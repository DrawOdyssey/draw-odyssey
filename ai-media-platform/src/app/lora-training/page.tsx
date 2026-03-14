"use client";

import { useState, useRef } from "react";
import AppShell from "@/components/layout/AppShell";
import {
  Brain, Upload, Loader2, X, Image as ImageIcon, Sparkles,
  CheckCircle2, Clock, Trash2, Play, Settings2, Info, Zap,
} from "lucide-react";

interface TrainingImage {
  id: string;
  preview: string;
  file?: File;
}

interface TrainedModel {
  id: string;
  name: string;
  triggerWord: string;
  status: "training" | "ready" | "failed";
  createdAt: string;
  imageCount: number;
  thumbnailUrl?: string;
}

const TRAINING_OPTIONS = [
  { id: "flux-lora", name: "Flux LoRA", description: "Train on FLUX Dev — best quality, ~5 min", creditCost: 40, badge: "popular" },
  { id: "flux-lora-fast", name: "Fast Flux LoRA", description: "8x H100 GPUs — train in ~2 min", creditCost: 25, badge: "fast" },
  { id: "sdxl-lora", name: "SDXL LoRA", description: "Train on SDXL — good for stylized art", creditCost: 20, badge: null },
];

export default function LoRATrainingPage() {
  const [images, setImages] = useState<TrainingImage[]>([]);
  const [modelName, setModelName] = useState("");
  const [triggerWord, setTriggerWord] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState(TRAINING_OPTIONS[0]);
  const [steps, setSteps] = useState(1000);
  const [training, setTraining] = useState(false);
  const [trainedModels, setTrainedModels] = useState<TrainedModel[]>([]);
  const [activeTab, setActiveTab] = useState<"train" | "models">("train");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const newImages: TrainingImage[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      preview: URL.createObjectURL(file),
      file,
    }));
    setImages((prev) => [...prev, ...newImages].slice(0, 20));
  }

  function removeImage(id: string) {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }

  async function handleStartTraining() {
    if (images.length < 3 || !modelName.trim() || !triggerWord.trim()) return;
    setTraining(true);

    // Simulate training start (replace with real API call)
    setTimeout(() => {
      const newModel: TrainedModel = {
        id: Math.random().toString(36).substr(2, 9),
        name: modelName,
        triggerWord,
        status: "training",
        createdAt: new Date().toISOString(),
        imageCount: images.length,
        thumbnailUrl: images[0]?.preview,
      };
      setTrainedModels((prev) => [newModel, ...prev]);
      setTraining(false);
      setActiveTab("models");
      setImages([]);
      setModelName("");
      setTriggerWord("");
    }, 2000);
  }

  return (
    <AppShell>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
            <Brain className="w-6 h-6 text-purple-400" />
            LoRA Model Training
          </h1>
          <p className="text-surface-400 text-sm">
            Train custom AI models on your images. Create consistent characters, styles, or products.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("train")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "train" ? "bg-purple-600 text-white" : "bg-surface-800 text-surface-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4" /> Train New Model
          </button>
          <button
            onClick={() => setActiveTab("models")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "models" ? "bg-purple-600 text-white" : "bg-surface-800 text-surface-400 hover:text-white"
            }`}
          >
            <Brain className="w-4 h-4" /> My Models
            {trainedModels.length > 0 && (
              <span className="text-xs bg-surface-700 px-1.5 py-0.5 rounded-full">{trainedModels.length}</span>
            )}
          </button>
        </div>

        {activeTab === "train" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Training config */}
            <div className="lg:col-span-1 space-y-4">
              {/* Trainer selection */}
              <div className="card !p-4">
                <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Training Method</h3>
                <div className="space-y-2">
                  {TRAINING_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedTrainer(opt)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedTrainer.id === opt.id
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-surface-700/50 bg-surface-800/50 hover:border-surface-600"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm font-medium text-white">{opt.name}</span>
                        <span className="text-xs text-surface-400">{opt.creditCost} credits</span>
                      </div>
                      <p className="text-[11px] text-surface-500">{opt.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Model config */}
              <div className="card !p-4 space-y-4">
                <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Configuration</h3>
                <div>
                  <label className="text-xs text-surface-400 mb-1 block">Model Name</label>
                  <input
                    type="text"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    placeholder="e.g. My Character Style"
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-surface-400 mb-1 block">
                    Trigger Word
                    <span className="text-surface-600 ml-1">(used in prompts to activate your model)</span>
                  </label>
                  <input
                    type="text"
                    value={triggerWord}
                    onChange={(e) => setTriggerWord(e.target.value)}
                    placeholder="e.g. MYCHAR"
                    className="input-field text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-surface-400 mb-1 block">Training Steps: {steps}</label>
                  <input
                    type="range"
                    min={500}
                    max={3000}
                    step={100}
                    value={steps}
                    onChange={(e) => setSteps(parseInt(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                  <div className="flex justify-between text-[10px] text-surface-600 mt-1">
                    <span>500 (fast)</span>
                    <span>3000 (highest quality)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center + Right: Image upload */}
            <div className="lg:col-span-2 space-y-4">
              <div className="card !p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
                    Training Images ({images.length}/20)
                  </h3>
                  <span className="text-xs text-surface-500">Upload 3-20 high-quality images</span>
                </div>

                {/* Image grid */}
                <div className="grid grid-cols-4 md:grid-cols-5 gap-2 mb-3">
                  {images.map((img) => (
                    <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-surface-700">
                      <img src={img.preview} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(img.id)}
                        className="absolute top-1 right-1 p-1 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}

                  {/* Upload button */}
                  {images.length < 20 && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square border-2 border-dashed border-surface-700 rounded-lg flex flex-col items-center justify-center hover:border-surface-500 transition-colors"
                    >
                      <Upload className="w-5 h-5 text-surface-500 mb-1" />
                      <span className="text-[10px] text-surface-500">Add</span>
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />

                {/* Tips */}
                <div className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-surface-400 space-y-1">
                      <p className="font-medium text-purple-300">Tips for best results:</p>
                      <p>&#x2022; Use 5-15 high-quality images of your subject</p>
                      <p>&#x2022; Include variety: different angles, lighting, backgrounds</p>
                      <p>&#x2022; Crop tightly around the subject when possible</p>
                      <p>&#x2022; Avoid blurry, low-resolution, or heavily filtered images</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Start training button */}
              <button
                onClick={handleStartTraining}
                disabled={training || images.length < 3 || !modelName.trim() || !triggerWord.trim()}
                className="btn-primary w-full !py-3 bg-purple-600 hover:bg-purple-500"
              >
                {training ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Starting training...</>
                ) : (
                  <><Brain className="w-4 h-4" /> Start Training ({selectedTrainer.creditCost} credits)</>
                )}
              </button>

              {images.length > 0 && images.length < 3 && (
                <p className="text-xs text-yellow-400 text-center">Add at least 3 images to start training</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "models" && (
          <div>
            {trainedModels.length === 0 ? (
              <div className="card text-center !py-20">
                <Brain className="w-12 h-12 mx-auto text-surface-600 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No trained models yet</h3>
                <p className="text-surface-400 text-sm mb-6">Train your first LoRA model to create consistent characters, styles, or products.</p>
                <button onClick={() => setActiveTab("train")} className="btn-primary inline-flex bg-purple-600 hover:bg-purple-500">
                  <Sparkles className="w-4 h-4" /> Train Your First Model
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trainedModels.map((model) => (
                  <div key={model.id} className="card-hover">
                    <div className="flex items-start gap-3 mb-3">
                      {model.thumbnailUrl ? (
                        <img src={model.thumbnailUrl} alt="" className="w-14 h-14 rounded-lg object-cover border border-surface-700" />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-surface-800 flex items-center justify-center">
                          <Brain className="w-6 h-6 text-surface-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-white truncate">{model.name}</h3>
                        <p className="text-xs text-surface-500 font-mono">trigger: {model.triggerWord}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {model.status === "training" && (
                          <span className="flex items-center gap-1 text-xs text-yellow-400">
                            <Loader2 className="w-3 h-3 animate-spin" /> Training...
                          </span>
                        )}
                        {model.status === "ready" && (
                          <span className="flex items-center gap-1 text-xs text-green-400">
                            <CheckCircle2 className="w-3 h-3" /> Ready
                          </span>
                        )}
                        {model.status === "failed" && (
                          <span className="flex items-center gap-1 text-xs text-red-400">
                            <X className="w-3 h-3" /> Failed
                          </span>
                        )}
                        <span className="text-[10px] text-surface-600">{model.imageCount} images</span>
                      </div>
                      {model.status === "ready" && (
                        <button className="btn-ghost text-xs !py-1 !px-2">
                          <Play className="w-3 h-3" /> Use
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
