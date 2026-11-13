/**
 * Web Audio API synthesizer for home hero interactive sound effects
 */

export function playIncomingAlertSound(): void {
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    if (!AC) return
    const ctx = new AC()
    const now = ctx.currentTime

    for (let i = 0; i < 3; i++) {
      const t = now + i * 0.6
      const ping = ctx.createOscillator()
      const pingGain = ctx.createGain()
      ping.type = "sine"
      ping.connect(pingGain)
      pingGain.connect(ctx.destination)
      ping.frequency.setValueAtTime(880, t)
      ping.frequency.exponentialRampToValueAtTime(440, t + 0.3)
      pingGain.gain.setValueAtTime(0, t)
      pingGain.gain.linearRampToValueAtTime(0.2, t + 0.02)
      pingGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5)
      ping.start(t)
      ping.stop(t + 0.5)
    }

    const rumble = ctx.createOscillator()
    const rumbleGain = ctx.createGain()
    rumble.type = "sawtooth"
    rumble.connect(rumbleGain)
    rumbleGain.connect(ctx.destination)
    rumble.frequency.setValueAtTime(40, now)
    rumble.frequency.linearRampToValueAtTime(80, now + 2)
    rumbleGain.gain.setValueAtTime(0, now)
    rumbleGain.gain.linearRampToValueAtTime(0.08, now + 0.3)
    rumbleGain.gain.setValueAtTime(0.08, now + 1.5)
    rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5)
    rumble.start(now)
    rumble.stop(now + 2.5)
  } catch (e) {
    console.warn("Alert audio failed", e)
  }
}

export async function playZapSound(): Promise<void> {
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    if (!AC) return
    const ctx = new AC()
    await ctx.resume()
    const now = ctx.currentTime

    const makeDistortionCurve = (amount = 400) => {
      const n_samples = 44100
      const curve = new Float32Array(n_samples)
      const deg = Math.PI / 180
      for (let i = 0; i < n_samples; ++i) {
        const x = (i * 2) / n_samples - 1
        curve[i] =
          ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x))
      }
      return curve
    }

    const masterCompressor = ctx.createDynamicsCompressor()
    masterCompressor.threshold.setValueAtTime(-10, now)
    masterCompressor.knee.setValueAtTime(40, now)
    masterCompressor.ratio.setValueAtTime(12, now)
    masterCompressor.attack.setValueAtTime(0, now)
    masterCompressor.release.setValueAtTime(0.25, now)
    masterCompressor.connect(ctx.destination)

    const distNode = ctx.createWaveShaper()
    distNode.curve = makeDistortionCurve(800)
    distNode.oversample = "4x"
    distNode.connect(masterCompressor)

    const bufferSize = ctx.sampleRate * 4
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const output = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1
    }
    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuffer
    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = "bandpass"
    noiseFilter.frequency.setValueAtTime(3000, now)
    noiseFilter.frequency.exponentialRampToValueAtTime(8000, now + 1)
    noiseFilter.frequency.exponentialRampToValueAtTime(100, now + 4)
    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0, now)
    noiseGain.gain.linearRampToValueAtTime(1, now + 0.05)
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 4)
    noise.connect(noiseFilter)
    noiseFilter.connect(distNode)

    const stutter = ctx.createOscillator()
    stutter.type = "square"
    stutter.frequency.setValueAtTime(20, now)
    stutter.frequency.linearRampToValueAtTime(60, now + 2)
    const stutterGain = ctx.createGain()
    stutter.connect(stutterGain.gain)
    noiseGain.connect(stutterGain)
    stutterGain.connect(distNode)

    noise.start(now)
    stutter.start(now)
    noise.stop(now + 4)
    stutter.stop(now + 4)

    const slash = ctx.createOscillator()
    const slashGain = ctx.createGain()
    slash.type = "sawtooth"
    slash.connect(slashGain)
    slashGain.connect(distNode)
    slash.frequency.setValueAtTime(5000, now)
    slash.frequency.exponentialRampToValueAtTime(100, now + 1.5)
    slashGain.gain.setValueAtTime(0, now)
    slashGain.gain.linearRampToValueAtTime(0.8, now + 0.01)
    slashGain.gain.exponentialRampToValueAtTime(0.01, now + 1.5)
    slash.start(now)
    slash.stop(now + 1.6)

    const sub = ctx.createOscillator()
    const subGain = ctx.createGain()
    sub.type = "sine"
    sub.connect(subGain)
    subGain.connect(distNode)
    sub.frequency.setValueAtTime(120, now)
    sub.frequency.exponentialRampToValueAtTime(15, now + 8)
    subGain.gain.setValueAtTime(0, now)
    subGain.gain.linearRampToValueAtTime(1, now + 0.1)
    subGain.gain.setValueAtTime(1, now + 4)
    subGain.gain.exponentialRampToValueAtTime(0.01, now + 12)
    sub.start(now)
    sub.stop(now + 12.1)

    const carrier = ctx.createOscillator()
    const modulator = ctx.createOscillator()
    const modGain = ctx.createGain()
    const fmGain = ctx.createGain()
    carrier.type = "square"
    modulator.type = "sawtooth"
    carrier.frequency.setValueAtTime(200, now + 3)
    carrier.frequency.linearRampToValueAtTime(1800, now + 12)
    carrier.frequency.linearRampToValueAtTime(50, now + 20)
    modulator.frequency.setValueAtTime(400, now + 3)
    modulator.frequency.linearRampToValueAtTime(50, now + 15)
    modGain.gain.setValueAtTime(1000, now + 3)
    modGain.gain.linearRampToValueAtTime(100, now + 18)
    modulator.connect(modGain)
    modGain.connect(carrier.frequency)
    carrier.connect(fmGain)
    fmGain.connect(masterCompressor)
    fmGain.gain.setValueAtTime(0, now + 3)
    fmGain.gain.linearRampToValueAtTime(0.15, now + 5)
    fmGain.gain.setValueAtTime(0.15, now + 16)
    fmGain.gain.exponentialRampToValueAtTime(0.001, now + 22)
    carrier.start(now + 3)
    modulator.start(now + 3)
    carrier.stop(now + 22.1)
    modulator.stop(now + 22.1)

    const drone = ctx.createOscillator()
    const droneFilter = ctx.createBiquadFilter()
    const droneGain = ctx.createGain()
    drone.type = "sawtooth"
    drone.frequency.setValueAtTime(55, now + 15)
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.type = "sine"
    lfo.frequency.setValueAtTime(0.5, now + 15)
    lfo.frequency.linearRampToValueAtTime(2, now + 30)
    lfoGain.gain.value = 800
    droneFilter.type = "lowpass"
    droneFilter.frequency.value = 1000
    lfo.connect(lfoGain)
    lfoGain.connect(droneFilter.frequency)
    drone.connect(droneFilter)
    droneFilter.connect(droneGain)
    droneGain.connect(distNode)
    droneGain.gain.setValueAtTime(0, now + 15)
    droneGain.gain.linearRampToValueAtTime(0.4, now + 20)
    droneGain.gain.setValueAtTime(0.4, now + 28)
    droneGain.gain.exponentialRampToValueAtTime(0.001, now + 32)
    drone.start(now + 15)
    lfo.start(now + 15)
    drone.stop(now + 32.1)
    lfo.stop(now + 32.1)

    const freqs = [300, 315, 330, 800, 820]
    freqs.forEach((freq, index) => {
      const tear = ctx.createOscillator()
      const tearGain = ctx.createGain()
      tear.type = "triangle"
      tear.connect(tearGain)
      tearGain.connect(masterCompressor)
      tear.frequency.setValueAtTime(freq, now + 25)
      const resolveFreq = [220, 277.18, 329.63, 440, 659.25][index] || 440
      tear.frequency.exponentialRampToValueAtTime(resolveFreq, now + 34)
      tearGain.gain.setValueAtTime(0, now + 25)
      tearGain.gain.linearRampToValueAtTime(0.05, now + 30)
      tearGain.gain.setValueAtTime(0.05, now + 35)
      tearGain.gain.exponentialRampToValueAtTime(0.001, now + 38)
      tear.start(now + 25)
      tear.stop(now + 38.1)
    })

    const drill1 = ctx.createOscillator()
    const drill2 = ctx.createOscillator()
    const drillGain = ctx.createGain()
    drill1.type = "sine"
    drill2.type = "sine"
    drill1.frequency.setValueAtTime(7000, now + 32)
    drill2.frequency.setValueAtTime(7150, now + 32)
    drill1.frequency.exponentialRampToValueAtTime(432, now + 41)
    drill2.frequency.exponentialRampToValueAtTime(432, now + 41)
    drillGain.gain.setValueAtTime(0, now + 32)
    drillGain.gain.linearRampToValueAtTime(0.12, now + 32.5)
    drillGain.gain.setValueAtTime(0.12, now + 39)
    drillGain.gain.exponentialRampToValueAtTime(0.0001, now + 41)
    drill1.connect(drillGain)
    drill2.connect(drillGain)
    drillGain.connect(masterCompressor)
    drill1.start(now + 32)
    drill2.start(now + 32)
    drill1.stop(now + 41.1)
    drill2.stop(now + 41.1)

    const bowlMain = ctx.createOscillator()
    const bowlHarmonic = ctx.createOscillator()
    const bowlGain = ctx.createGain()
    bowlMain.type = "sine"
    bowlHarmonic.type = "sine"
    bowlMain.frequency.setValueAtTime(432, now + 41)
    bowlHarmonic.frequency.setValueAtTime(432 * 1.5, now + 41)
    bowlGain.gain.setValueAtTime(0, now + 41)
    bowlGain.gain.linearRampToValueAtTime(0.4, now + 41.05)
    bowlGain.gain.exponentialRampToValueAtTime(0.0001, now + 49)
    bowlMain.connect(bowlGain)
    bowlHarmonic.connect(bowlGain)
    bowlGain.connect(masterCompressor)
    bowlMain.start(now + 41)
    bowlHarmonic.start(now + 41)
    bowlMain.stop(now + 49.1)
    bowlHarmonic.stop(now + 49.1)
  } catch (e) {
    console.warn("Zap audio play failed", e)
  }
}
