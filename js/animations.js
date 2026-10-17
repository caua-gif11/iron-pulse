export function initAnimations(sceneController=null){
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero=document.querySelector('.hero');
  if(window.gsap&&window.ScrollTrigger){
    const gsap=window.gsap;gsap.registerPlugin(window.ScrollTrigger);
    if(!reduced){
      gsap.from('.hero .eyebrow,.hero .hero-lead,.hero .hero-actions,.hero .hero-proof',{y:18,opacity:0,stagger:.1,duration:.75,ease:'power3.out',delay:.25});
      gsap.fromTo('.hero .title-line',{yPercent:40,clipPath:'inset(0 0 100% 0)',opacity:0},{yPercent:0,clipPath:'inset(0 0 -10% 0)',opacity:1,stagger:.16,duration:1.1,ease:'power4.out',delay:.18});
      gsap.from('.hero-visual',{scale:.86,opacity:0,duration:1.35,ease:'power3.out',delay:.28});
      const progress={value:0};
      gsap.to(progress,{value:1,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.8,onUpdate:()=>sceneController?.setProgress(progress.value)}});
      gsap.utils.toArray('.section').forEach(section=>gsap.from(section.querySelectorAll('.section-kicker,h2,.section-lead'),{scrollTrigger:{trigger:section,start:'top 82%'},y:25,opacity:0,stagger:.08,duration:.65,ease:'power2.out'}));
      gsap.utils.toArray('[data-count]').forEach(el=>{const end=+el.dataset.count;window.ScrollTrigger.create({trigger:el,start:'top 85%',once:true,onEnter:()=>gsap.to({n:0},{n:end,duration:1.5,ease:'power2.out',onUpdate(){el.textContent=Math.round(this.targets()[0].n).toLocaleString('pt-BR')}})})});
      // Scroll-reactive glass ornaments add one restrained focal point per feature section.
      [['.modalities','02'],['.plans','04'],['.trainers','05']].forEach(([selector,label],index)=>{
        const section=document.querySelector(selector);if(!section)return;
        const orb=document.createElement('span');orb.className=`section-orb section-orb-${index+1}`;orb.setAttribute('aria-hidden','true');section.append(orb);
        const number=document.createElement('span');number.className='section-number-outline';number.textContent=label;number.setAttribute('aria-hidden','true');section.append(number);
        gsap.fromTo(number,{color:'rgba(225,6,0,0)'},{color:'rgba(225,6,0,.07)',scrollTrigger:{trigger:section,start:'top 80%',end:'center center',scrub:.8}});
        gsap.to(orb,{rotation:360,ease:'none',scrollTrigger:{trigger:section,start:'top bottom',end:'bottom top',scrub:1}});
      });
    }
  }
  // Cursor-following card sheen and low-amplitude 3D tilt, also works without GSAP.
  document.querySelectorAll('.modality-card,.trainer-card,.plan-card').forEach(card=>{
    card.addEventListener('pointermove',event=>{
      if(reduced||innerWidth<700||event.pointerType==='touch')return;
      const rect=card.getBoundingClientRect(),x=(event.clientX-rect.left)/rect.width,y=(event.clientY-rect.top)/rect.height;
      card.style.setProperty('--glow-x',`${x*100}%`);card.style.setProperty('--glow-y',`${y*100}%`);
      card.style.transform=`perspective(900px) rotateX(${(0.5-y)*4}deg) rotateY(${(x-0.5)*5}deg) translateY(-2px)`;
    });
    card.addEventListener('pointerleave',()=>{card.style.transform='';card.style.setProperty('--glow-x','50%');card.style.setProperty('--glow-y','50%')});
  });
}
