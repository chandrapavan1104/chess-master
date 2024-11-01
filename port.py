from flask import Flask, request, jsonify
import json
from flask_restful import Api, Resource
from flask_cors import CORS
import chess
from stockfish import Stockfish
import traceback

app = Flask(__name__)
CORS(app)
api = Api(app)

# Load the configuration file
with open('./config.json') as config_file:
    config = json.load(config_file)

STOCKFISH_PATH = config['STOCKFISH_PATH']

# Stockfish difficulty levels configuration
STOCKFISH_LEVELS = {
    'easy': 1,
    'medium': 5,
    'hard': 10
}

class ChessGame:
    def __init__(self, fen=None):
        self.stockfish = None
        try:
            self.stockfish = Stockfish(STOCKFISH_PATH)
            if fen == 'start' or fen is None:
                self.board = chess.Board()
            else:
                self.board = chess.Board(fen)
            self.stockfish.set_fen_position(self.board.fen())
        except Exception as e:
            print(f"Error initializing ChessGame: {e}")

    def set_difficulty(self, level):
        self.stockfish.set_skill_level(STOCKFISH_LEVELS[level])

    def checkmate(self):
        return self.board.is_checkmate()

    def make_move(self, move):
        try:
            self.board.push_san(move)
            self.stockfish.set_fen_position(self.board.fen())
            return True, ""
        except Exception as e:
            return False, str(e)

    def get_stockfish_move(self):
        try:
            move = self.stockfish.get_best_move()
            self.board.push_san(move)
            self.stockfish.set_fen_position(self.board.fen())
            return move
        except Exception as e:
            print(f"Error getting Stockfish move: {e}")
            return None

class NewGame(Resource):
    def post(self):
        try:
            data = request.get_json()
            difficulty = data['difficulty']
            color = data['color']
            game = ChessGame()
            game.set_difficulty(difficulty)
            return jsonify({"board_fen": game.board.fen(), "difficulty": difficulty})
        except Exception as e:
            print(f"Error in NewGame: {e}")
            return {"message": "Internal server error"}, 500

class MakeMove(Resource):
    def post(self):
        try:
            data = request.get_json()
            fen = data['fen']
            move = data['move']
            difficulty = data['difficulty']
            best_move = ''
            game = ChessGame(fen)
            game.set_difficulty(difficulty)
            
            success, error = game.make_move(move)
            if not success:
                return {"message": error}, 400
            
            stockfish_move = game.get_stockfish_move()
            if not stockfish_move:
                return {"message": "Error getting Stockfish move"}, 500

            if not game.checkmate():
                game.set_difficulty('hard')
                best_move = game.get_stockfish_move()
                if not stockfish_move:
                    return {"message": "Error getting Stockfish move"}, 500

            return jsonify({"stockfish_move": stockfish_move, "board_fen": game.board.fen(), 'best_move': best_move})
        except Exception as e:
            print(f"Error in MakeMove: {e}")
            return {"message": "Internal server error"}, 500

# class SuggestMove(Resource):
#     def post(self):
#         try:
#             data = request.get_json()
#             fen = data['fen']
#             game = ChessGame(fen)
#             best_move = game.get_stockfish_move()
#             return jsonify({'best_move': best_move})
#         except Exception as e:
#             print(f"Error in SuggestMove: {e}")
#             return {"message": "Internal server error"}, 500
        
class AnalysePosition(Resource):
    def evaluate_position(self):
        try:
            data = request.get_json()
            fen = data.get('fen')
            if not fen:
                return jsonify({'error': 'No FEN provided'}), 400

            with chess.engine.SimpleEngine.popen_uci(STOCKFISH_PATH) as engine:
                board = chess.Board(fen)
                try:
                    # Perform a single analysis for both score and mate chances
                    result = engine.analyse(board, chess.engine.Limit(depth=20))

                    # Extract score information (evaluation for white)
                    score = result['score'].white().score()
                    normalized_score = self.normalize_score(score)

                    # Extract mate information (if any)
                    mate_in_moves = result['score'].white().mate()
                    print(mate_in_moves)
                    mate_chances = self.get_mate_chances(mate_in_moves)

                    print(fen, normalized_score, mate_chances)

                except chess.engine.EngineTerminatedError:
                    return jsonify({'error': 'Stockfish engine terminated unexpectedly'}), 500
                except Exception as e:
                    return jsonify({'error': f'Error during analysis: {str(e)}'}), 500

            return jsonify({
                'score': normalized_score,
                'mate_chances': mate_chances
            })

        except Exception as e:
            print(traceback.format_exc())  # Print the full traceback to the console
            return jsonify({'error': str(e)}), 500
        
    def normalize_score(score):
        if score is None:
            return 0.5
        max_score = 1000
        score = max(min(score, max_score), -max_score)
        return (score + max_score) / (2 * max_score)

    def get_mate_chances(mate_in_moves):
        # Check if the engine found a mate in a certain number of moves
        if mate_in_moves is not None:
            if mate_in_moves == 1:
                return "Mate in 1!"
            elif mate_in_moves == 2:
                return "Mate in 2!"
            elif mate_in_moves == 3:
                return "Mate in 3!"
            else:
                return f"Mate in {mate_in_moves} moves!"
        return "No forced mate in 3 moves."

api.add_resource(NewGame, '/new_game')
api.add_resource(MakeMove, '/make_move')
api.add_resource(AnalysePosition, '/evaluate')
#api.add_resource(SuggestMove, '/suggest_move')

if __name__ == '__main__':
    app.run(debug=True, port=8080)




if __name__ == '__main__':
    app.run(port=8080)
