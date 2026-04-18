"use client";
import { useState, useRef } from "react";
import { Mic, Square, Play, Pause, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface RecorderProps {
  onRecordingComplete: (blob: Blob, url: string) => void;
}

export function Recorder({ onRecordingComplete }: RecorderProps) {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [playing, setPlaying] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRef.current.onstop = () => {
        const newBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(newBlob);
        setBlob(newBlob);
        setAudioUrl(url);
        onRecordingComplete(newBlob, url);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error("Failed to start recording:", err);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRef.current && recording) {
      mediaRef.current.stop();
      setRecording(false);
    }
  };

  const togglePlayback = () => {
    if (!audioUrl) return;

    if (!audioElementRef.current) {
      audioElementRef.current = new Audio(audioUrl);
      audioElementRef.current.onended = () => setPlaying(false);
    }

    if (playing) {
      audioElementRef.current.pause();
      setPlaying(false);
    } else {
      audioElementRef.current.play();
      setPlaying(true);
    }
  };

  const clearRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setBlob(null);
    setPlaying(false);
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={recording ? stopRecording : startRecording}
        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
          recording
            ? "bg-danger animate-pulse shadow-danger/30"
            : "bg-primary shadow-primary/30 hover:brightness-110"
        }`}
      >
        {recording ? (
          <Square className="w-8 h-8 text-white fill-white" />
        ) : (
          <Mic className="w-8 h-8 text-bg" />
        )}
      </motion.button>

      <p className="text-text-muted text-sm">
        {recording ? "Recording... tap to stop" : "Tap to record your recitation"}
      </p>

      {audioUrl && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-surface-elevated rounded-xl p-3 w-full max-w-sm"
        >
          <button
            onClick={togglePlayback}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:brightness-110 transition-all"
          >
            {playing ? (
              <Pause className="w-5 h-5 text-bg" />
            ) : (
              <Play className="w-5 h-5 text-bg ml-0.5" />
            )}
          </button>

          <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              animate={{ width: playing ? "100%" : "0%" }}
              transition={{ duration: 10, ease: "linear" }}
              style={{ display: playing ? "block" : "none" }}
            />
          </div>

          <button
            onClick={clearRecording}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-danger transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
