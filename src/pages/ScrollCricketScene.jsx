import { useEffect, useRef } from "react";
import * as THREE from "three";
import { CONTACT_PROGRESS, PLAYER_ATLAS, atlasCell, ballFlight, photoSceneAtProgress } from "./photorealMotion.js";

const clamp = THREE.MathUtils.clamp;
const smooth = (a, b, x) => THREE.MathUtils.smoothstep(x, a, b);

// Every position is derived from scroll progress: no clock or autoplay timeline.
export default function ScrollCricketScene({ progressRef }) {
  const hostRef = useRef(null);
  useEffect(() => {
    const host = hostRef.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch {
      host.classList.add("ck-webgl-unavailable");
      const photo = host.querySelector('.ck-photo-fallback');
      let fallbackFrame;
      let previous=-1;
      const updatePhoto=()=>{
        fallbackFrame=requestAnimationFrame(updatePhoto);
        const p=progressRef.current;
        if(p===previous)return;
        previous=p;
        const state=photoSceneAtProgress(p,[.37,-.5,.402]);
        const cell=atlasCell(state.pose.blend<.5?state.pose.first:state.pose.second);
        photo.style.backgroundPosition=`${cell.column/3*100}% ${cell.row/2*100}%`;
        photo.style.opacity=state.playerOpacity;
        photo.style.transform=`translateX(${state.ending*35}vw)`;
      };
      updatePhoto();
      return ()=>{cancelAnimationFrame(fallbackFrame);host.classList.remove('ck-webgl-unavailable');};
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);
    let lastProgress = -1;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, .1, 100);
    camera.position.set(0, 0, 11);
    scene.add(new THREE.HemisphereLight(0xc1dcff, 0x150908, 3));
    const key = new THREE.DirectionalLight(0xffede0, 5);
    key.position.set(-3, 5, 6); scene.add(key);
    const rim = new THREE.DirectionalLight(0x8ecbff, 4);
    rim.position.set(5, 2, -2); scene.add(rim);

    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = 512; textureCanvas.height = 256;
    const ctx = textureCanvas.getContext("2d");
    ctx.fillStyle = "#8e2e20"; ctx.fillRect(0, 0, 512, 256);
    let seed = 18;
    const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    for (let i = 0; i < 25000; i++) {
      ctx.fillStyle = random() > .5 ? "rgba(255,190,150,.16)" : "rgba(15,2,1,.22)";
      ctx.fillRect(random() * 512, random() * 256, 1.5, 1.5);
    }
    const leather = new THREE.CanvasTexture(textureCanvas);
    leather.colorSpace = THREE.SRGBColorSpace;
    const ball = new THREE.Group();
    ball.add(new THREE.Mesh(new THREE.SphereGeometry(.68, 64, 48), new THREE.MeshStandardMaterial({ map: leather, roughness: .42, metalness: .04, bumpMap: leather, bumpScale: .025 })));
    const seamMaterial = new THREE.MeshStandardMaterial({ color: 0xe8d7b6, roughness: .7 });
    for (const offset of [-.075, -.035, .035, .075]) {
      const radius = Math.sqrt(.685 ** 2 - offset ** 2);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, .005, 5, 128), seamMaterial);
      ring.rotation.y = Math.PI / 2; ring.position.x = offset; ball.add(ring);
      for (let i = 0; i < 66; i++) {
        const angle = i / 66 * Math.PI * 2;
        const stitch = new THREE.Mesh(new THREE.CapsuleGeometry(.004, .023, 2, 3), seamMaterial);
        stitch.position.set(offset, Math.cos(angle) * (radius + .003), Math.sin(angle) * (radius + .003));
        stitch.rotation.x = angle; stitch.rotation.z = -.6; ball.add(stitch);
      }
    }
    scene.add(ball);

    // Photographic pose frames replace the procedural human mesh entirely.
    // Each full-body pose is a single photographic silhouette; the bat and hands are
    // already present together in each generated frame and cannot become detached.
    let atlasReady = false;
    const contact = new THREE.Vector3(.37,-.50,.402);
    const atlas = new THREE.TextureLoader().load(PLAYER_ATLAS.source, texture => {
      texture.colorSpace = THREE.SRGBColorSpace;
      atlasReady = true;
      lastProgress = -1;
    });
    atlas.colorSpace = THREE.SRGBColorSpace;
    const player = new THREE.Group();
    scene.add(player);
    const photoMaterial = new THREE.ShaderMaterial({
      transparent:true,depthWrite:false,
      uniforms:{
        atlas:{value:atlas},firstCell:{value:new THREE.Vector2(0,2)},secondCell:{value:new THREE.Vector2(0,2)},
        blend:{value:0},opacity:{value:0},atlasSize:{value:new THREE.Vector2(1448,1086)},
      },
      vertexShader:`varying vec2 photoUv;
        void main(){photoUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
      fragmentShader:`uniform sampler2D atlas;
        uniform vec2 firstCell; uniform vec2 secondCell; uniform vec2 atlasSize;
        uniform float blend; uniform float opacity; varying vec2 photoUv;
        void main(){
          vec2 tileSize=vec2(4.0,3.0);
          vec2 safeUv=clamp(photoUv,vec2(2.0)/atlasSize*tileSize,vec2(1.0)-vec2(2.0)/atlasSize*tileSize);
          // Keep a single crisp photographic silhouette; crossfading limbs
          // would create an artificial second bat between source poses.
          vec4 pose=texture2D(atlas,(safeUv+firstCell)/tileSize);
          gl_FragColor=vec4(pose.rgb,pose.a*opacity);
          if(gl_FragColor.a<.01)discard;
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    });
    const photoPlane = new THREE.Mesh(new THREE.PlaneGeometry(4.6,4.6),photoMaterial);
    photoPlane.position.z=.15;
    photoPlane.renderOrder=2;
    player.add(photoPlane);
    const setPose = pose => {
      const selected=atlasCell(pose.blend<.5?pose.first:pose.second);
      photoMaterial.uniforms.firstCell.value.set(selected.column,2-selected.row);
      photoMaterial.uniforms.secondCell.value.set(selected.column,2-selected.row);
      photoMaterial.uniforms.blend.value=0;
    };

    // Reference-style translucent wisps; the bitmap has real transparent gaps.
    let smokeReady=false;
    const smokeTexture=new THREE.TextureLoader().load('/image/crickt-reference-smoke.png',()=>{
      smokeReady=true;lastProgress=-1;
    });
    smokeTexture.colorSpace=THREE.SRGBColorSpace;
    const smokeMaterial=new THREE.ShaderMaterial({
      transparent:true,depthWrite:false,
      uniforms:{map:{value:smokeTexture},time:{value:0},strength:{value:1}},
      vertexShader:`varying vec2 smokeUv;void main(){smokeUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
      fragmentShader:`varying vec2 smokeUv;uniform sampler2D map;uniform float time;uniform float strength;
        void main(){
          vec2 uv=smokeUv;
          float tail=1.0-uv.x;
          // Anchor the leading tip and advect only the loose trailing vapor.
          float travel=time*.055;
          float wave=sin(uv.x*13.0+time*.9)*.009+sin(uv.x*27.0+time*1.4)*.004;
          uv.y+=wave*tail;
          uv.x+=sin(uv.y*12.0+time*.6)*.004*tail;
          vec4 vapor=texture2D(map,uv);
          vec2 wakeUv=uv;
          wakeUv.x=uv.x+sin(travel)*.024*tail;
          wakeUv.y+=sin(uv.x*19.0+time*.75)*.018*tail;
          vec4 wake=texture2D(map,wakeUv);
          float edge=smoothstep(.025,.24,uv.x)*(1.0-smoothstep(.97,1.0,uv.x));
          // Fade large tail loops while retaining thin cream-colored filaments.
          float tailFade=mix(.30,1.0,smoothstep(.08,.65,uv.x));
          float alpha=(vapor.a*.72+wake.a*.28)*strength*edge*tailFade;
          vec3 tint=mix(vapor.rgb,vec3(.85,.78,.63),.20);
          gl_FragColor=vec4(tint,alpha);
          #include <colorspace_fragment>
        }`,
    });
    const smoke=new THREE.Mesh(new THREE.PlaneGeometry(3.6,1.05),smokeMaterial);
    scene.add(smoke);

    const dustCount=180;
    const dustPositions=new Float32Array(dustCount*3);
    const dustSeeds=Array.from({length:dustCount},()=>({age:random(),height:random()-.5,depth:random()-.5,phase:random()*Math.PI*2}));
    const dustGeometry=new THREE.BufferGeometry();
    dustGeometry.setAttribute('position',new THREE.BufferAttribute(dustPositions,3));
    const dust=new THREE.Points(dustGeometry,new THREE.PointsMaterial({color:0xd5c4a2,size:.009,transparent:true,opacity:.38,depthWrite:false}));
    dust.frustumCulled=false;scene.add(dust);

    // A tapered, glowing swept ribbon follows the bat from backlift to contact.
    const swingMaterial=new THREE.ShaderMaterial({
      transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,
      uniforms:{strength:{value:0}},
      vertexShader:`varying vec2 sweepUv;void main(){sweepUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
      fragmentShader:`varying vec2 sweepUv;uniform float strength;
        void main(){
          float v=abs(sweepUv.y*2.0-1.0);
          float core=exp(-v*v*65.0);
          float halo=exp(-v*v*5.0);
          float fibers=.8+.2*sin(sweepUv.x*130.0+sweepUv.y*14.0);
          float taper=pow(max(0.0,sin(sweepUv.x*3.14159)),.4);
          float alpha=(core*.45+halo*.32)*taper*fibers*strength;
          gl_FragColor=vec4(mix(vec3(1.0,.55,.16),vec3(1.0,.94,.72),core),alpha);
          #include <colorspace_fragment>
        }`,
    });
    const swingRibbons=Array.from({length:3},(_,layer)=>{
      const mesh=new THREE.Mesh(new THREE.PlaneGeometry(1,1,100,1),swingMaterial);
      mesh.userData.layer=layer;mesh.frustumCulled=false;mesh.renderOrder=3;
      scene.add(mesh);return mesh;
    });

    const makeTrail = (color, radius) => {
      const points = Array.from({ length: 100 }, () => new THREE.Vector3());
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: .8, blending: THREE.AdditiveBlending }));
      scene.add(line);
      // A thin luminous tube gives the trajectory depth and a bright core.
      const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(-3,-1,0),new THREE.Vector3(0,2,0),new THREE.Vector3(3,0,0)]);
      const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 80, radius, 5, false), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .8, blending: THREE.AdditiveBlending }));
      scene.add(tube);
      return { line, tube };
    };
    const trails = [makeTrail(0xffc66f, .012), makeTrail(0xc5ffe1, .018), makeTrail(0x8beed9, .009)];
    const sparkGeometry = new THREE.BufferGeometry();
    const sparkPositions = new Float32Array(180 * 3);
    const directions = Array.from({ length:180 }, () => new THREE.Vector3(random() - .5, random() - .5, (random() - .5) * .7).normalize().multiplyScalar(.5 + random() * 2));
    sparkGeometry.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));
    const sparks = new THREE.Points(sparkGeometry, new THREE.PointsMaterial({ color: 0xffe2a4, size: .035, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    scene.add(sparks);
    const shock = new THREE.Mesh(new THREE.RingGeometry(.9, 1, 96), new THREE.MeshBasicMaterial({ color:0xcefff5, transparent:true, side:THREE.DoubleSide, blending:THREE.AdditiveBlending, depthWrite:false }));
    scene.add(shock);
    let visible = true;
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; });
    observer.observe(host);
    let mobile = false;
    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      renderer.setSize(width, height); lastProgress = -1;
      camera.aspect = width / Math.max(height, 1);
      mobile = width < 700; camera.fov = mobile ? 38 : 36; camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host); resize();
    const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
    const started=performance.now();
    let frame;
    const render = () => {
      frame = requestAnimationFrame(render);
      if (!visible || document.hidden) return;
      const p = progressRef.current;
      const flowing=p<.2 && !reduceMotion.matches;
      if (Math.abs(p - lastProgress) < .00001 && !flowing) return;
      smokeMaterial.uniforms.time.value=reduceMotion.matches?0:(performance.now()-started)/1000;
      lastProgress = p;
      const state = photoSceneAtProgress(p,contact.toArray());
      const {flight,ending,pose} = state;
      ball.position.fromArray(state.position);
      ball.scale.setScalar(state.ballScale*(1+.25*(1-smooth(.05,.2,p))));
      ball.rotation.set(p*4,p*11,-.5+p*5);
      player.visible=atlasReady && state.playerOpacity>.001;
      player.position.set(THREE.MathUtils.lerp(-1.1,mobile?.7:2,ending),-.1-ending*.65,0);
      setPose(pose);
      photoMaterial.uniforms.opacity.value=state.playerOpacity;
      const burst = clamp((p - CONTACT_PROGRESS) / .095, 0, 1);
      const burstOpacity = smooth(CONTACT_PROGRESS,.455,p) * (1 - smooth(CONTACT_PROGRESS,.49,p));
      shock.visible = burstOpacity > .001;
      shock.position.copy(contact); shock.scale.setScalar(.1 + burst * 2.3); shock.material.opacity = burstOpacity;
      sparks.material.opacity = burstOpacity * (1 - burst * .4);
      directions.forEach((v,i) => { sparkPositions[i*3]=contact.x+v.x*burst*2; sparkPositions[i*3+1]=contact.y+v.y*burst*2; sparkPositions[i*3+2]=contact.z+v.z*burst; });
      sparkGeometry.attributes.position.needsUpdate = true;
      const introTrail = 1 - smooth(.11,.2,p);
      smoke.visible=smokeReady && introTrail>.001;
      smokeMaterial.uniforms.strength.value=introTrail*.57;
      smoke.position.set(state.position[0]-1.87,state.position[1]-.40,state.position[2]-.42);
      smoke.rotation.z=.31;
      dust.visible=smoke.visible;
      dust.material.opacity=introTrail*.33;
      if(dust.visible){
        const time=smokeMaterial.uniforms.time.value;
        dustSeeds.forEach((particle,index)=>{
          const age=(particle.age+time*.045)%1;
          const spread=.12+Math.sin(age*Math.PI)*.60;
          dustPositions[index*3]=state.position[0]-.5-age*2.9;
          dustPositions[index*3+1]=state.position[1]-.15-age*.92+particle.height*spread+Math.sin(time*.7+particle.phase)*.025;
          dustPositions[index*3+2]=state.position[2]-.45+particle.depth*spread;
        });
        dustGeometry.attributes.position.needsUpdate=true;
      }
      const swingAmount=smooth(.17,CONTACT_PROGRESS,p);
      const swingOpacity=smooth(.15,.24,p)*(1-smooth(.44,.54,p));
      swingMaterial.uniforms.strength.value=swingOpacity;
      swingRibbons.forEach(ribbon=>{
        ribbon.visible=swingOpacity>.001;
        if(!ribbon.visible)return;
        const layer=ribbon.userData.layer;
        const positions=ribbon.geometry.attributes.position;
        for(let vertex=0;vertex<positions.count;vertex++){
          const u=ribbon.geometry.attributes.uv.getX(vertex);
          const side=ribbon.geometry.attributes.uv.getY(vertex)*2-1;
          const angle=2.15+u*(.45+swingAmount*3.05);
          const width=(.18+layer*.10)*(.3+Math.sin(u*Math.PI)*.7);
          const radius=1.64+side*width+layer*.018;
          positions.setXYZ(vertex,-.95+Math.cos(angle)*radius,.17+Math.sin(angle)*(1.14+side*width),.43+layer*.018);
        }
        positions.needsUpdate=true;
      });
      const trailOpacity = smooth(CONTACT_PROGRESS,.49,p) * (1 - smooth(.77,.86,p));
      trails.forEach(({line,tube},index) => {
        line.visible = tube.visible = trailOpacity > .001;
        line.material.opacity = trailOpacity * .8; tube.material.opacity = trailOpacity * .8;
        if (!line.visible) return;
        const pts = [];
        for (let i=0;i<100;i++) {
          const t = i / 99 * Math.max(flight,.0001);
          const point=new THREE.Vector3().fromArray(ballFlight(t,contact.toArray()));
          // Tracking arcs are used only after the shot, never on the intro ball.
          const spread = Math.sin(t/Math.max(flight,.0001)*Math.PI);
          point.y+=spread*(index===0?.35:-.08*index);
          point.z+=spread*.1*index;
          pts.push(point);
        }
        line.geometry.setFromPoints(pts);
        tube.geometry.dispose(); tube.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 70, index===1?.018:.01, 5, false);
      });
      camera.position.set(THREE.MathUtils.lerp(0,1.1,smooth(.49,.75,p))*(1-ending),.12,THREE.MathUtils.lerp(11,12.5,smooth(.49,.75,p)));
      camera.lookAt(THREE.MathUtils.lerp(0,1.4,smooth(.49,.75,p))*(1-ending),.1,0);
      renderer.render(scene,camera);
    };
    render();
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); resizeObserver.disconnect();
      scene.traverse(object => { if (object.geometry) object.geometry.dispose(); if (object.material) { const materials = Array.isArray(object.material) ? object.material : [object.material]; materials.forEach(material => material.dispose()); } });
      leather.dispose(); atlas.dispose(); smokeTexture.dispose(); renderer.dispose(); renderer.domElement.remove();
    };
  }, [progressRef]);
  return <div className="ck-webgl-scene" ref={hostRef} aria-hidden="true"><div className="ck-webgl-fallback" /><div className="ck-photo-fallback" /></div>;
}
