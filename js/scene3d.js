// Cinematic glass spheres. CDN/import failures and reduced-motion devices use the CSS fallback.
export function initScene(){
  const canvas=document.querySelector('#hero-canvas'),hero=document.querySelector('.hero');
  if(!canvas||!hero)return null;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const state={progress:0,ready:false};
  const controller={setProgress(value){state.progress=Math.max(0,Math.min(1,value))}};
  if(reduced){hero.classList.add('scene-fallback');return controller}
  let teardown=()=>{};
  const fallback=()=>{hero.classList.add('scene-fallback');canvas.hidden=true};
  const boot=async()=>{
    try{
      const [THREE,{RoomEnvironment},{EffectComposer},{RenderPass},{UnrealBloomPass}]=await Promise.all([
        import('three'),import('three/addons/environments/RoomEnvironment.js'),import('three/addons/postprocessing/EffectComposer.js'),import('three/addons/postprocessing/RenderPass.js'),import('three/addons/postprocessing/UnrealBloomPass.js')
      ]);
      const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:innerWidth>700,powerPreference:'high-performance'});
      renderer.setPixelRatio(Math.min(devicePixelRatio,2));
      renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
      const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(32,1,.1,100);camera.position.set(0,0,7.4);
      const pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(new RoomEnvironment(),.04).texture;pmrem.dispose();
      scene.add(new THREE.HemisphereLight(0xffffff,0x161012,1.25));
      const key=new THREE.DirectionalLight(0xffffff,2.2);key.position.set(3,4,5);scene.add(key);
      const rim=new THREE.DirectionalLight(0xe10600,4.2);rim.position.set(-4,1,2);scene.add(rim);
      const fill=new THREE.PointLight(0xff8a45,1.1,10);fill.position.set(1,-2,4);scene.add(fill);
      const blackMaterial=new THREE.MeshPhysicalMaterial({color:0x09090b,metalness:.38,roughness:.25,clearcoat:1,clearcoatRoughness:.12,sheen:1,sheenColor:0x301b20,sheenRoughness:.32,envMapIntensity:1.15});
      const orbBase=new THREE.Color(0x09090b),orbDeep=new THREE.Color(0x010102);
      const redMaterial=new THREE.MeshStandardMaterial({color:0xff3514,emissive:0xe10600,emissiveIntensity:3.1,metalness:.18,roughness:.28});
      const mainOrb=new THREE.Mesh(new THREE.SphereGeometry(innerWidth<700?1.48:1.82,innerWidth<700?48:80,innerWidth<700?32:64),blackMaterial);
      mainOrb.position.set(.38,.02,0);scene.add(mainOrb);
      const redOrb=new THREE.Mesh(new THREE.SphereGeometry(innerWidth<700?.72:.94,innerWidth<700?40:64,innerWidth<700?28:48),redMaterial);
      redOrb.position.set(-1.38,-.7,-.25);scene.add(redOrb);
      const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));
      const bloom=new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),innerWidth<700?.48:.72,.62,.13);composer.addPass(bloom);
      let width=0,height=0,visible=true,raf=0,mouseX=0,mouseY=0,smoothX=0,smoothY=0,last=performance.now(),sampleStart=last,sampleFrames=0,useBloom=innerWidth>700;
      const resize=()=>{const r=hero.getBoundingClientRect();if(!r.width||!r.height)return;width=r.width;height=r.height;renderer.setSize(width,height,false);composer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix()};
      const pointer=e=>{const r=hero.getBoundingClientRect();mouseX=((e.clientX-r.left)/r.width-.5)*2;mouseY=((e.clientY-r.top)/r.height-.5)*2;hero.style.setProperty('--mouse-x',`${(e.clientX-r.left)/r.width*100}%`);hero.style.setProperty('--mouse-y',`${(e.clientY-r.top)/r.height*100}%`);hero.style.setProperty('--text-x',`${mouseX*5}px`);hero.style.setProperty('--text-y',`${mouseY*4}px`)};
      const activate=()=>{if(!canvas.hidden){mainOrb.rotation.y+=Math.PI*2;mainOrb.rotation.x+=Math.PI;import('./ui.js').then(m=>m.toast('A força está dentro de você. Bora treinar!'))}};
      const click=()=>activate(),keydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate()}};
      const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible&&!raf)raf=requestAnimationFrame(frame)},{threshold:.01});observer.observe(hero);
      hero.addEventListener('pointermove',pointer,{passive:true});canvas.addEventListener('click',click);canvas.addEventListener('keydown',keydown);addEventListener('resize',resize,{passive:true});resize();hero.classList.add('webgl-ready');state.ready=true;
      function frame(now){raf=0;if(!visible)return;const elapsed=Math.min((now-last)/1000,.05);last=now;sampleFrames++;
        smoothX+=(mouseX-smoothX)*.035;smoothY+=(mouseY-smoothY)*.035;
        const t=now*.00035,p=state.progress;
        mainOrb.position.x=.38-smoothX*.34;mainOrb.position.y=Math.sin(t)*.08-smoothY*.24;mainOrb.position.z=-p*.35;
        mainOrb.scale.setScalar(1+p*.28);mainOrb.rotation.y+=elapsed*.08;mainOrb.rotation.x+=elapsed*.035;
        blackMaterial.color.copy(orbBase).lerp(orbDeep,p);
        redOrb.position.x=-1.38+Math.cos(t)*.23+smoothX*.2+(p*.95);redOrb.position.y=-.7+Math.sin(t*1.2)*.18+smoothY*.12;redOrb.scale.setScalar(1+p*.1);
        camera.position.z=7.4-p*.75;camera.position.x=smoothX*.06;camera.lookAt(0,0,0);
        if(useBloom){composer.render()}else{renderer.render(scene,camera)}
        if(now-sampleStart>=1600){const fps=sampleFrames*1000/(now-sampleStart);if(fps<40)useBloom=false;sampleFrames=0;sampleStart=now}
        if(visible)raf=requestAnimationFrame(frame)
      }
      raf=requestAnimationFrame(frame);
      teardown=()=>{observer.disconnect();cancelAnimationFrame(raf);hero.removeEventListener('pointermove',pointer);canvas.removeEventListener('click',click);canvas.removeEventListener('keydown',keydown);removeEventListener('resize',resize);mainOrb.geometry.dispose();redOrb.geometry.dispose();blackMaterial.dispose();redMaterial.dispose();composer.dispose();renderer.dispose()};
      addEventListener('pagehide',teardown,{once:true});
    }catch(error){console.warn('IRON PULSE: cena 3D indisponível; usando fallback CSS.',error);fallback()}
  };
  void boot();
  return controller;
}
