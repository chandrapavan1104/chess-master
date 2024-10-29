from flask import Flask, request, jsonify
from flask_cors import CORS
import chess
import chess.engine
import traceback

app = Flask(__name__)
CORS(app)

# Path to your Stockfish executable
STOCKFISH_PATH = "/opt/homebrew/bin/stockfish"

@app.route('/evaluate', methods=['POST'])
def evaluate_position():
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
                normalized_score = normalize_score(score)

                # Extract mate information (if any)
                mate_in_moves = result['score'].white().mate()
                print(mate_in_moves)
                mate_chances = get_mate_chances(mate_in_moves)

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

if __name__ == '__main__':
    app.run(port=8080)
