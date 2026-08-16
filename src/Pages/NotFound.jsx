import React from "react";
import { useNavigate } from "react-router-dom";
import { FiHome, FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import { Button } from "../Components/ui/Button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 transition-colors duration-300">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-surface/90 p-8 sm:p-12 shadow-pop backdrop-blur-xl text-center">
        {/* Glow backdrop decoration */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-accent/20 blur-3xl pointer-events-none" />

        {/* 404 Visual Icon */}
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-inner">
          <FiAlertCircle className="h-12 w-12 animate-pulse" />
          <span className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-mono text-xs font-bold">
            404
          </span>
        </div>

        {/* Title & Subtitle */}
        <h1 className="font-display text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl mb-3">
          Page Not Found
        </h1>
        <p className="text-sm text-muted leading-relaxed mb-8 max-w-sm mx-auto">
          The requested page or resource could not be found or may have been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto gap-2"
          >
            <FiArrowLeft size={18} />
            Go Back
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate("/")}
            className="w-full sm:w-auto gap-2 shadow-lift"
          >
            <FiHome size={18} />
            Return Home
          </Button>
        </div>

        <p className="mt-8 text-xs text-subtle font-mono">
          Medorc Health Orchestrator &bull; Error 404
        </p>
      </div>
    </div>
  );
}
