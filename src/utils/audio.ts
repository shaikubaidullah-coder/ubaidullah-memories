// Procedural Web Audio API sound synthesizer engine & ambient generator

export class SoundEngine {
  private static ctx: AudioContext | null = null;
  private static activeSourceNodes: (AudioNode & { stop?: (when?: number) => void })[] = [];
  private static activeLFO: (OscillatorNode & { stop?: (when?: number) => void }) | null = null;
  private static chordTimer: NodeJS.Timeout | null = null;
  public static currentChannel: 'lofi' | 'rain' | 'crackle' | 'off' = 'off';

  public static init(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      } catch (e) {
        console.warn('Web Audio API is not supported in this browser:', e);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public static stopAll() {
    if (this.chordTimer) {
      clearInterval(this.chordTimer);
      this.chordTimer = null;
    }
    this.activeSourceNodes.forEach((node) => {
      try {
        if ('stop' in node && typeof node.stop === 'function') {
          node.stop();
        }
      } catch {
        // node already stopped
      }
    });
    this.activeSourceNodes = [];
    if (this.activeLFO) {
      try {
        this.activeLFO.stop();
      } catch {
        // lfo already stopped
      }
      this.activeLFO = null;
    }
  }

  public static setChannel(channel: 'lofi' | 'rain' | 'crackle' | 'off') {
    this.init();
    if (!this.ctx) return;
    this.stopAll();
    this.currentChannel = channel;
    if (channel === 'lofi') this.startLofiSynth();
    else if (channel === 'rain') this.startRainSynth();
    else if (channel === 'crackle') this.startCrackleSynth();
  }

  public static cycleChannel(): string {
    const channels: ('lofi' | 'rain' | 'crackle' | 'off')[] = ['lofi', 'rain', 'crackle', 'off'];
    const nextIdx = (channels.indexOf(this.currentChannel) + 1) % channels.length;
    const nextChannel = channels[nextIdx];
    this.setChannel(nextChannel);
    this.playPopClick();
    return nextChannel;
  }

  public static startLofiSynth() {
    const ctx = this.ctx;
    if (!ctx) return;
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(4.2, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(1.8, ctx.currentTime);
    lfo.connect(lfoGain);
    lfo.start();
    this.activeLFO = lfo;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(380, ctx.currentTime);

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.18, ctx.currentTime);
    filter.connect(master);
    master.connect(ctx.destination);

    const chords = [
      [138.59, 164.81, 207.65, 277.18], // Dbmaj7
      [185.0, 220.0, 277.18, 369.99],   // F#m7
      [220.0, 277.18, 329.63, 440.0],   // Amaj7
      [246.94, 311.13, 369.99, 493.88], // B7
    ];
    let chordIdx = 0;

    const playChord = () => {
      const chord = chords[chordIdx];
      chordIdx = (chordIdx + 1) % chords.length;

      const chordGain = ctx.createGain();
      chordGain.gain.setValueAtTime(0.001, ctx.currentTime);
      chordGain.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 0.05);
      chordGain.gain.setValueAtTime(0.14, ctx.currentTime + 1.8 - 0.5);
      chordGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);

      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        lfoGain.connect(osc.frequency);
        osc.connect(chordGain);
        osc.start();
        osc.stop(ctx.currentTime + 1.8);
        this.activeSourceNodes.push(osc);
      });

      chordGain.connect(filter);
    };

    playChord();
    this.chordTimer = setInterval(playChord, 2200);
  }

  public static startRainSynth() {
    const ctx = this.ctx;
    if (!ctx) return;
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = 2 * Math.random() - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(950, ctx.currentTime);
    filter.Q.setValueAtTime(0.6, ctx.currentTime);

    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.15, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0.04, ctx.currentTime);
    lfo.connect(lfoGain);

    const outGain = ctx.createGain();
    outGain.gain.setValueAtTime(0.12, ctx.currentTime);

    lfoGain.connect(filter.frequency);
    whiteNoise.connect(filter);
    filter.connect(outGain);
    outGain.connect(ctx.destination);

    whiteNoise.start();
    lfo.start();
    this.activeSourceNodes.push(whiteNoise);
    this.activeLFO = lfo;
  }

  public static startCrackleSynth() {
    const ctx = this.ctx;
    if (!ctx) return;
    const bufferSize = 1.5 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (2 * Math.random() - 1) * 0.08;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    filter.Q.setValueAtTime(1, ctx.currentTime);

    const outGain = ctx.createGain();
    outGain.gain.setValueAtTime(0.06, ctx.currentTime);

    noise.connect(filter);
    filter.connect(outGain);
    outGain.connect(ctx.destination);
    noise.start();
    this.activeSourceNodes.push(noise);

    const triggerPop = () => {
      if (this.currentChannel !== 'crackle') return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.012);
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.015);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.02);
      setTimeout(triggerPop, 80 + 900 * Math.random());
    };
    triggerPop();
  }

  public static playPaperRustle() {
    this.init();
    const ctx = this.ctx;
    if (!ctx) return;
    const duration = 0.45;
    const bufferSize = Math.floor(duration * ctx.sampleRate);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = 2 * Math.random() - 1;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + duration);
    filter.Q.setValueAtTime(1.5, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration - 0.02);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start();
    source.stop(ctx.currentTime + duration);
  }

  public static playPopClick() {
    this.init();
    const ctx = this.ctx;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  public static playSparkle() {
    this.init();
    const ctx = this.ctx;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, ctx.currentTime);
    osc.frequency.setValueAtTime(1200, ctx.currentTime + 0.08);
    osc.frequency.setValueAtTime(1500, ctx.currentTime + 0.16);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }

  public static playJarPop() {
    this.init();
    const ctx = this.ctx;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(340, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  }
}
