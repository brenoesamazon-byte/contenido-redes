"""Genera latido, whoosh y música de fondo suave en public/local/ (no van en git).
Uso: python3 scripts/gen_sfx.py   (desde motion/studio)"""
import numpy as np, soundfile as sf, os
from numpy.fft import rfft, irfft
sr=48000; out_dir=os.path.join(os.path.dirname(__file__),"..","public","local"); os.makedirs(out_dir,exist_ok=True)
def thump(f0,dur,amp):
    t=np.arange(int(sr*dur))/sr; ph=2*np.pi*np.cumsum(f0*(1+1.5*np.exp(-t*40)))/sr
    env=(1-np.exp(-t*300))*np.exp(-t*18); return amp*(np.sin(ph)+0.25*np.sin(2*ph))*env
hb=np.zeros(sr*12); per=60/72
for k in range(int(12/per)):
    t0=int(k*per*sr); a=thump(55,.22,1); b=thump(48,.2,.7)
    hb[t0:t0+len(a)]+=a[:len(hb)-t0]; t1=t0+int(.28*sr); hb[t1:t1+len(b)]+=b[:max(0,len(hb)-t1)]
hb/=np.abs(hb).max()*1.05; sf.write(f"{out_dir}/heartbeat.wav",np.stack([hb,hb],1),sr)
n=int(sr*.6); t=np.arange(n)/sr; noise=np.random.randn(n); y=np.zeros(n); win=2048
for i in range(0,n-win,win//2):
    F=rfft(noise[i:i+win]*np.hanning(win)); fr=np.fft.rfftfreq(win,1/sr); c=300+(i/n)*3500
    F*=np.exp(-((fr-c)/(c*.6))**2); y[i:i+win]+=irfft(F)
y*=np.sin(np.pi*t/.6)**2; y/=np.abs(y).max()*1.1; sf.write(f"{out_dir}/whoosh.wav",np.stack([y,y*.9],1),sr)
L=60; t=np.arange(sr*L)/sr; pad=np.zeros_like(t); ch=[[220,261.63,329.63],[174.61,220,261.63],[130.81,196,261.63],[196,246.94,293.66]]
for i in range(int(L/4)+1):
    s0=i*4.0; m=(t>=s0-.5)&(t<s0+5.5); tt=t[m]-s0; e=np.clip(tt/1.2+.4,0,1)*np.clip((5.5-tt)/1.5,0,1)
    for fq in ch[i%4]: pad[m]+=e*(np.sin(2*np.pi*fq*tt)+.3*np.sin(4*np.pi*fq*tt+.5)+.5*np.sin(np.pi*fq*tt))
pad*=.85+.15*np.sin(2*np.pi*.25*t); pad/=np.abs(pad).max()*1.1; sf.write(f"{out_dir}/pad.wav",np.stack([pad,pad*.97],1),sr)
print("ok:", out_dir)
