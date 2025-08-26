import React, { useState, useRef } from 'react';
import { Upload, Play, Download, Settings, Zap, Film, Clock, Star } from 'lucide-react';

function App() {
  const [video, setVideo] = useState(null);
  const [speed, setSpeed] = useState(4);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoPreview, setVideoPreview] = useState(null);
  const [quality, setQuality] = useState('medium');
  const [removeAudio, setRemoveAudio] = useState(true);
  const fileInputRef = useRef(null);

  const speedPresets = [
    { value: 2, label: '2x' },
    { value: 4, label: '4x' },
    { value: 8, label: '8x' },
    { value: 16, label: '16x' },
  ];

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!video) return;

    setIsProcessing(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 10;
      });
    }, 500);

    const formData = new FormData();
    formData.append('video', video);
    formData.append('speed', speed);
    formData.append('quality', quality);
    formData.append('removeAudio', removeAudio);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setDownloadUrl(result.download_url);
        setProgress(100);
        
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
      clearInterval(progressInterval);
    }
  };

  const resetForm = () => {
    setVideo(null);
    setVideoPreview(null);
    setDownloadUrl('');
    setProgress(0);
    setIsProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Background Effects */}
<div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&#34;60&#34; height=&#34;60&#34; viewBox=&#34;0 0 60 60&#34; xmlns=&#34;http://www.w3.org/2000/svg&#34;%3E%3Cg fill=&#34;none&#34; fill-rule=&#34;evenodd&#34;%3E%3Cg fill=&#34;%239C92AC&#34; fill-opacity=&#34;0.1&#34;%3E%3Ccircle cx=&#34;30&#34; cy=&#34;30&#34; r=&#34;4&#34;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              TimeLapse Pro
            </h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Transform your videos into stunning time-lapse masterpieces with our advanced processing engine
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
            
            {/* Upload Section */}
            <d iv className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <Upload className="w-6 h-6" />
                Upload Your Video
              </h2>
              
              <div 
                className="border-2 border-dashed border-purple-400/50 rounded-2xl p-8 text-center bg-white/5 hover:bg-white/10 transition-all cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoSelect}
                  className="hidden"
                />
                
                {videoPreview ? (
                  <div className="space-y-4">
                    <video
                      src={videoPreview}
                      className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                      controls
                      style={{ maxHeight: '200px' }}
                    />
                    <div className="flex items-center justify-center gap-2 text-green-400">
                      <Film className="w-5 h-5" />
                      <span className="font-medium">{video?.name}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-xl font-medium text-white mb-2">
                        Drop your video here or click to browse
                      </p>
                      <p className="text-gray-400">
                        Supports MP4, MOV, AVI, and more
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </d>

            {/* Settings Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <Settings className="w-6 h-6" />
                Processing Settings
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Speed Selection */}
                <div className="space-y-4">
                  <label className="text-white font-medium flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Speed Multiplier
                  </label>
                  <div className="flex gap-2 mb-4">
                    {speedPresets.map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() => setSpeed(preset.value)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          speed === preset.value
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">Custom:</span>
                    <input
                      type="number"
                      value={speed}
                      onChange={(e) => setSpeed(Number(e.target.value))}
                      min="1"
                      max="100"
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white w-20"
                    />
                    <span className="text-gray-300">x</span>
                  </div>
                </div>

                {/* Quality & Audio */}
                <div className="space-y-4">
                  <label className="text-white font-medium flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Output Quality
                  </label>
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  >
                    <option  className='text-black' value="low">Low (Fast)</option>
                    <option  className='text-black'value="medium">Medium</option>
                    <option  className='text-black'value="high">High (Slow)</option>
                  </select>
                  
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={removeAudio}
                      onChange={(e) => setRemoveAudio(e.target.checked)}
                      className="rounded"
                    />
                    Remove Audio
                  </label>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {isProcessing && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Processing...</span>
                  <span className="text-purple-400">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button 
                onClick={handleUpload}
                disabled={!video || isProcessing}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-4 px-8 rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Create Timelapse
                  </>
                )}
              </button>
              
              <button
                onClick={resetForm}
                className="px-6 py-4 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all"
              >
                Reset
              </button>
            </div>

            {/* Download Section */}
            {downloadUrl && (
              <div className="mt-8 p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <Download className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Your Timelapse is Ready!</h3>
                      <p className="text-gray-300 text-sm">Click to download your processed video</p>
                    </div>
                  </div>
                  <a
                    href={downloadUrl}
                    download
                    className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-3 rounded-lg transition-all flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Why Choose TimeLapse Pro?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-300">Advanced processing engine for quick results</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">High Quality</h3>
              <p className="text-gray-300">Professional-grade output with customizable settings</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Film className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Easy to Use</h3>
              <p className="text-gray-300">Simple interface, powerful results</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;