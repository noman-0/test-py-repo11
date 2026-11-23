/**
 * Procedural soundscape (Web Audio) - no audio files, no licences.
 * OFF by default; only ever started from a user gesture (the Sound toggle).
 *  - ambience: soft café room tone (filtered brown noise) + a quiet warm pad
 *  - occasional faint cup "clink"
 *  - UI cues: open / close / select / pour
 */
type Cue = "open" | "close" | "select" | "pour";

class Soundscape {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private nodes: AudioNode[] = [];
  private clinkTimer: number | null = null;
  private running = false;

  get isRunning() {
    return this.running;
  }

  start() {
    if (typeof window === "undefined") return;
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      if (!this.ctx) {
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0;
        this.master.connect(this.ctx.destination);
      }
      void this.ctx.resume();
      if (!this.running) this.buildAmbience();
      this.running = true;
      const t = this.ctx.currentTime;
      this.master!.gain.cancelScheduledValues(t);
      this.master!.gain.setTargetAtTime(0.55, t, 0.6);
      this.scheduleClink();
    } catch {
      this.running = false;
    }
  }

  stop() {
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setTargetAtTime(0, t, 0.25);
    this.running = false;
    if (this.clinkTimer) window.clearTimeout(this.clinkTimer);
    this.clinkTimer = null;
    const ctx = this.ctx;
    window.setTimeout(() => {
      if (!this.running) {
        this.nodes.forEach((n) => {
          try {
            (n as AudioScheduledSourceNode).stop?.();
          } catch {
            /* already stopped */
          }
          n.disconnect();
        });
        this.nodes = [];
        void ctx.suspend();
      }
    }, 1200);
  }

  cue(type: Cue) {
    if (!this.running || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    if (type === "pour") {
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer(1.4, "white");
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.Q.value = 2.5;
      bp.frequency.setValueAtTime(500, t);
      bp.frequency.exponentialRampToValueAtTime(1800, t + 1.2);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.05, t + 0.15);
      g.gain.exponentialRampToValueAtTime(0.0005, t + 1.35);
      src.connect(bp).connect(g).connect(this.master);
      src.start(t);
      src.stop(t + 1.4);
      return;
    }
    const notes = type === "open" ? [523.25, 783.99] : type === "close" ? [783.99, 523.25] : [659.25];
    notes.forEach((f, i) => this.tone(f, t + i * 0.09, 0.9, 0.035));
  }

  private tone(freq: number, at: number, dur: number, peak: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = freq;
    const o2 = ctx.createOscillator();
    o2.type = "sine";
    o2.frequency.value = freq * 2.76; // bell-like partial
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(peak, at + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    const g2 = ctx.createGain();
    g2.gain.value = 0.25;
    o.connect(g);
    o2.connect(g2).connect(g);
    g.connect(this.master!);
    o.start(at);
    o2.start(at);
    o.stop(at + dur);
    o2.stop(at + dur);
  }

  private scheduleClink() {
    if (this.clinkTimer) window.clearTimeout(this.clinkTimer);
    this.clinkTimer = window.setTimeout(() => {
      if (!this.running || !this.ctx) return;
      this.tone(2300 + Math.random() * 500, this.ctx.currentTime, 0.5, 0.012);
      this.scheduleClink();
    }, 7000 + Math.random() * 9000);
  }

  private buildAmbience() {
    const ctx = this.ctx!;
    // room tone
    const noise = ctx.createBufferSource();
    noise.buffer = this.noiseBuffer(3, "brown");
    noise.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 520;
    const ng = ctx.createGain();
    ng.gain.value = 0.11;
    noise.connect(lp).connect(ng).connect(this.master!);
    noise.start();
    // warm pad (A2 + E3) with a slow breathing LFO
    const pad = ctx.createGain();
    pad.gain.value = 0.018;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.008;
    lfo.connect(lfoGain).connect(pad.gain);
    const oscs = [110, 164.81, 220.5].map((f) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      o.connect(pad);
      o.start();
      return o;
    });
    const padLp = ctx.createBiquadFilter();
    padLp.type = "lowpass";
    padLp.frequency.value = 900;
    pad.connect(padLp).connect(this.master!);
    lfo.start();
    this.nodes.push(noise, lp, ng, pad, lfo, lfoGain, padLp, ...oscs);
  }

  private noiseBuffer(seconds: number, kind: "white" | "brown") {
    const ctx = this.ctx!;
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      if (kind === "white") d[i] = w;
      else {
        last = (last + 0.02 * w) / 1.02;
        d[i] = last * 3.5;
      }
    }
    return buf;
  }
}

export const sound = new Soundscape();
