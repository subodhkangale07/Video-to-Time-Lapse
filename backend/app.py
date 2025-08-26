from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import subprocess
import shutil
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'static/videos'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def check_ffmpeg():
    """Check if FFmpeg is available in the system"""
    if shutil.which('ffmpeg') is not None:
        return True
    
    ffmpeg_path = r"S:\Downloads\ffmpeg-2025-06-28-git-cfd1f81e7d-essentials_build\ffmpeg-2025-06-28-git-cfd1f81e7d-essentials_build\bin\ffmpeg.exe"
    return os.path.exists(ffmpeg_path)

@app.route('/upload', methods=['POST'])
def upload_video():
    if not check_ffmpeg():
        return jsonify({
            'error': 'FFmpeg is not installed or not found in PATH. Please install FFmpeg first.',
            'help': 'Visit https://ffmpeg.org/download.html to download FFmpeg'
        }), 500

    if 'video' not in request.files:
        return jsonify({'error': 'No video file found'}), 400

    file = request.files['video']
    if file.filename == '':
        return jsonify({'error': 'No video file selected'}), 400

    speed = float(request.form.get('speed', 4))
    
    if speed <= 0:
        return jsonify({'error': 'Speed must be greater than 0'}), 400

    filename = secure_filename(file.filename)
    if not filename:
        return jsonify({'error': 'Invalid filename'}), 400

    input_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(input_path)

    output_filename = f"{os.path.splitext(filename)[0]}_timelapse.mp4"
    output_path = os.path.join(UPLOAD_FOLDER, output_filename)

    if os.path.exists(output_path):
        os.remove(output_path)

    ffmpeg_executable = shutil.which('ffmpeg')
    if not ffmpeg_executable:
        ffmpeg_executable = r"S:\Downloads\ffmpeg-2025-06-28-git-cfd1f81e7d-essentials_build\ffmpeg-2025-06-28-git-cfd1f81e7d-essentials_build\bin\ffmpeg.exe"
    
    ffmpeg_cmd = [
        ffmpeg_executable,
        '-i', input_path,
        '-filter:v', f'setpts={1/speed}*PTS',
        '-an',  
        '-y',   
        output_path
    ]
    
    print("Running FFmpeg command:", ' '.join(ffmpeg_cmd))

    try:
        result = subprocess.run(
            ffmpeg_cmd, 
            check=True, 
            capture_output=True, 
            text=True,
            timeout=300  
        )
        print("FFmpeg stdout:", result.stdout)
        
        os.remove(input_path)
        
        return jsonify({
            'download_url': f'http://localhost:5000/static/videos/{output_filename}',
            'message': 'Video processed successfully'
        })
        
    except subprocess.TimeoutExpired:
        return jsonify({'error': 'Video processing timed out'}), 500
    except subprocess.CalledProcessError as e:
        print("FFmpeg stderr:", e.stderr)
        if os.path.exists(input_path):
            os.remove(input_path)
        if os.path.exists(output_path):
            os.remove(output_path)
        return jsonify({
            'error': 'Video processing failed',
            'details': e.stderr
        }), 500
    except Exception as e:
        print("Unexpected error:", str(e))
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    ffmpeg_available = check_ffmpeg()
    return jsonify({
        'status': 'healthy' if ffmpeg_available else 'unhealthy',
        'ffmpeg_available': ffmpeg_available
    })

if __name__ == '__main__':
    print("Starting Flask app...")
    if check_ffmpeg():
        print("✓ FFmpeg is available")
    else:
        print("✗ FFmpeg is not available - please install it first")
    
    app.run(debug=True)