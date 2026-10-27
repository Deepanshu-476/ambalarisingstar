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
          vec2 tileSize = vec2(4.0, 3.0);
          vec2 safeUv = clamp(photoUv, vec2(2.0) / atlasSize * tileSize, vec2(1.0) - vec2(2.0) / atlasSize * tileSize);
          
          vec4 poseA = texture2D(atlas, (safeUv + firstCell) / tileSize);
          vec4 poseB = texture2D(atlas, (safeUv + secondCell) / tileSize);
          
          // Silky smooth cross-dissolve between consecutive key poses
          float t = smoothstep(0.32, 0.68, blend);
          vec4 pose = mix(poseA, poseB, t);
          if (pose.a < 0.02) discard;

          // Atmospheric Stadium Color Grading:
          // Transform flat studio blue into rich midnight navy/carbon team kit
          float lum = dot(pose.rgb, vec3(0.299, 0.587, 0.114));
          vec3 navyShadow = vec3(0.06, 0.11, 0.20) * lum * 1.5;
          vec3 graded = mix(pose.rgb * 0.82, navyShadow, 0.42);

          // Top-left biased edge detection matching stadium floodlight direction:
          vec2 off = vec2(3.5) / atlasSize * tileSize;
          float aL = mix(texture2D(atlas, (safeUv + firstCell - vec2(off.x, 0.0)) / tileSize).a, texture2D(atlas, (safeUv + secondCell - vec2(off.x, 0.0)) / tileSize).a, t);
          float aT = mix(texture2D(atlas, (safeUv + firstCell + vec2(0.0, off.y)) / tileSize).a, texture2D(atlas, (safeUv + secondCell + vec2(0.0, off.y)) / tileSize).a, t);
          float rimFactor = clamp((2.0 * pose.a - aL - aT) * 1.55, 0.0, 1.0);

          // Stadium floodlights cast a brilliant icy-white/cyan rim light along the batsman's silhouette
          vec3 floodlightRim = vec3(0.90, 0.97, 1.0) * pow(rimFactor, 1.05) * 1.65;

          vec3 finalColor = graded + floodlightRim;
          gl_FragColor = vec4(finalColor, pose.a * opacity);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    });
    const photoPlane = new THREE.Mesh(new THREE.PlaneGeometry(4.6,4.6),photoMaterial);
    photoPlane.position.z=.15;
    photoPlane.renderOrder=2;
    player.add(photoPlane);
    const setPose = pose => {
      const c1 = atlasCell(pose.first);
      const c2 = atlasCell(pose.second);
      photoMaterial.uniforms.firstCell.value.set(c1.column, 2 - c1.row);
      photoMaterial.uniforms.secondCell.value.set(c2.column, 2 - c2.row);
      photoMaterial.uniforms.blend.value = pose.blend;
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
          float v = abs(sweepUv.y * 2.0 - 1.0);
          float core = exp(-v * v * 48.0);
          float halo = exp(-v * v * 4.5);
          float fibers = 0.72 + 0.20 * sin(sweepUv.x * 110.0 + sweepUv.y * 12.0) + 0.14 * cos(sweepUv.x * 220.0);
          float taper = pow(max(0.0, sin(sweepUv.x * 3.14159)), 0.36);
          float alpha = (core * 0.95 + halo * 0.58) * taper * fibers * strength;
          vec3 amber = vec3(1.0, 0.46, 0.08);
          vec3 gold = vec3(1.0, 0.88, 0.45);
          vec3 hotCore = vec3(1.0, 0.98, 0.92);
          vec3 col = mix(amber, gold, clamp(core * 1.3, 0.0, 1.0));
          col = mix(col, hotCore, clamp(core * 1.5 - 0.45, 0.0, 1.0));
          gl_FragColor = vec4(col, alpha);
          #include <colorspace_fragment>
        }`,
    });
    const swingRibbons=Array.from({length:3},(_,layer)=>{
      const mesh=new THREE.Mesh(new THREE.PlaneGeometry(1,1,100,1),swingMaterial);
      mesh.userData.layer=layer;mesh.frustumCulled=false;mesh.renderOrder=3;
      scene.add(mesh);return mesh;
    });

    const ribbonShader = {
      vertexShader: `varying vec2 vUv;
        void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
      fragmentShader: `uniform vec3 coreColor; uniform vec3 glowColor; uniform float strength; uniform float time; uniform float isArc; varying vec2 vUv;
        void main(){
          float v = abs(vUv.y * 2.0 - 1.0);
          float core = exp(-v * v * (isArc > 0.5 ? 24.0 : 28.0));
          float glow = exp(-v * v * (isArc > 0.5 ? 5.5 : 3.2));
          float head = smoothstep(0.0, 0.08, vUv.x);
          float tail = isArc > 0.5 ? 1.0 : pow(vUv.x, 0.58);
          float ripple = isArc > 0.5 ? 1.0 : (0.88 + 0.12 * sin(vUv.x * 28.0 - time * 5.0));
          float alpha = (core * 0.95 + glow * 0.65) * head * tail * strength * ripple;
          vec3 col = mix(glowColor, coreColor, core * 0.85);
          gl_FragColor = vec4(col, alpha);
          #include <colorspace_fragment>
        }`
    };

    const createRibbon = (coreHex, glowHex, isArc = 0, renderOrder = 4) => {
      const segments = 80;
      const positions = new Float32Array(segments * 2 * 3);
      const uvs = new Float32Array(segments * 2 * 2);
      const indices = [];
      for (let i = 0; i < segments; i++) {
        const u = i / (segments - 1);
        uvs[i * 4 + 0] = u; uvs[i * 4 + 1] = 0;
        uvs[i * 4 + 2] = u; uvs[i * 4 + 3] = 1;
        if (i < segments - 1) {
          const a = i * 2;
          const b = a + 1;
          const c = a + 2;
          const d = a + 3;
          indices.push(a, b, c, b, d, c);
        }
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
      geo.setIndex(indices);
      const mat = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
        uniforms: {
          coreColor: { value: new THREE.Color(coreHex) },
          glowColor: { value: new THREE.Color(glowHex) },
          strength: { value: 0 },
          time: { value: 0 },
          isArc: { value: isArc }
        },
        ...ribbonShader
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.frustumCulled = false;
      mesh.renderOrder = renderOrder;
      scene.add(mesh);
      return mesh;
    };

    const ribbonMint = createRibbon(0xecffff, 0x36f2be, 0, 4);      // Main glowing mint ribbon
    const ribbonTwist = createRibbon(0xfffae8, 0x48e6c4, 0, 4);     // Intertwined secondary ribbon
    const ribbonAura = createRibbon(0x4bf0c5, 0x0aa880, 0, 3);      // Broad diffuse soft glow aura
    const arcOrange = createRibbon(0xfff4be, 0xff7000, 1, 4);       // High parabolic orange trajectory arc

    const cometFlareMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { strength: { value: 0 }, color: { value: new THREE.Color(0x7af7d2) } },
      vertexShader: `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
      fragmentShader: `uniform float strength; uniform vec3 color; varying vec2 vUv;
        void main(){
          vec2 p = vUv * 2.0 - 1.0;
          float d = length(p);
          float core = exp(-d * d * 18.0);
          float halo = exp(-d * d * 3.5);
          float alpha = (core * 0.95 + halo * 0.45) * strength;
          gl_FragColor = vec4(mix(color, vec3(1.0), core * 0.7), alpha);
          #include <colorspace_fragment>
        }`
    });
    const cometFlare = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.85), cometFlareMat);
    cometFlare.frustumCulled = false; cometFlare.renderOrder = 5;
    scene.add(cometFlare);
    const sparkGeometry = new THREE.BufferGeometry();
    const sparkPositions = new Float32Array(180 * 3);
    const directions = Array.from({ length:180 }, () => new THREE.Vector3(random() - .5, random() - .5, (random() - .5) * .7).normalize().multiplyScalar(.5 + random() * 2));
    sparkGeometry.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));
    const sparks = new THREE.Points(sparkGeometry, new THREE.PointsMaterial({ color: 0xffe2a4, size: .035, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    scene.add(sparks);
    const starburstMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
      uniforms: {
        strength: { value: 0 },
        burst: { value: 0 }
      },
      vertexShader: `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
      fragmentShader: `varying vec2 vUv; uniform float strength; uniform float burst;
        void main(){
          vec2 p = vUv * 2.0 - 1.0;
          float r = length(p);
          if (r > 1.0) discard;
          float angle = atan(p.y, p.x);
          
          // 32 jagged explosive blast spikes with varying harmonic lengths
          float spikes = 0.50 
            + 0.28 * sin(angle * 18.0) 
            + 0.16 * cos(angle * 36.0 + 1.2) 
            + 0.10 * sin(angle * 54.0 - 0.8)
            + 0.08 * cos(angle * 72.0 + 2.1);
            
          float rayDist = r / max(spikes, 0.05);
          float rayAlpha = clamp(1.0 - rayDist, 0.0, 1.0);
          rayAlpha = pow(rayAlpha, 1.7);
          
          // Expanding outer shockwave blast ring
          float ringPos = clamp(burst * 1.15, 0.05, 0.95);
          float ringDist = abs(r - ringPos);
          float ring = exp(-ringDist * ringDist * 130.0) * 1.4;
          
          // Brilliant incandescent core
          float core = exp(-r * r * 16.0);
          
          float totalAlpha = (core * 1.6 + rayAlpha * 1.25 + ring * 1.0) * strength;
          
          // Color ramp matching video frame 125 & 135: pure white core -> cyan/mint -> golden amber spiky tips
          vec3 amber = vec3(1.0, 0.52, 0.10);
          vec3 mint = vec3(0.55, 1.0, 0.88);
          vec3 coreCol = vec3(1.0, 1.0, 1.0);
          
          vec3 col = mix(amber, mint, clamp(core * 1.2 + ring * 0.6, 0.0, 1.0));
          col = mix(col, coreCol, clamp(core * 1.5, 0.0, 1.0));
          
          gl_FragColor = vec4(col, totalAlpha);
          #include <colorspace_fragment>
        }`
    });
    const starburst = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 3.6), starburstMat);
    starburst.frustumCulled = false;
    starburst.renderOrder = 6;
    scene.add(starburst);
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
      starburst.visible = burstOpacity > .001;
      starburst.position.copy(contact);
      starburst.scale.setScalar(.2 + burst * 3.4);
      starburstMat.uniforms.burst.value = burst;
      starburstMat.uniforms.strength.value = burstOpacity;
      sparks.material.opacity = burstOpacity * (1 - burst * .35);
      directions.forEach((v,i) => { sparkPositions[i*3]=contact.x+v.x*burst*2.6; sparkPositions[i*3+1]=contact.y+v.y*burst*2.6; sparkPositions[i*3+2]=contact.z+v.z*burst*1.5; });
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
          const width=(.22+layer*.12)*(.3+Math.sin(u*Math.PI)*.7);
          const radius=1.64+side*width+layer*.032;
          positions.setXYZ(vertex,-.95+Math.cos(angle)*radius,.17+Math.sin(angle)*(1.14+side*width),.43+layer*.025);
        }
        positions.needsUpdate=true;
      });
      const trailOpacity = smooth(CONTACT_PROGRESS, .49, p) * (1 - smooth(.77, .86, p));
      const hasTrail = trailOpacity > .001 && flight > .0001;
      const animTime = (performance.now() - started) / 1000;

      [ribbonMint, ribbonTwist, ribbonAura, arcOrange].forEach(ribbon => {
        ribbon.visible = hasTrail;
        ribbon.material.uniforms.strength.value = trailOpacity;
        ribbon.material.uniforms.time.value = animTime;
      });
      cometFlare.visible = hasTrail;
      cometFlareMat.uniforms.strength.value = trailOpacity;

      if (hasTrail) {
        const segCount = 80;
        const camPos = camera.position;

        const pts = [];
        for (let i = 0; i < segCount; i++) {
          const u = i / (segCount - 1);
          const t = u * Math.max(flight, 0.0001);
          pts.push(new THREE.Vector3().fromArray(ballFlight(t, contact.toArray())));
        }

        const updateRibbonGeometry = (mesh, getPointAndWidth) => {
          const positions = mesh.geometry.attributes.position;
          const curvePts = [];
          const widths = [];
          for (let i = 0; i < segCount; i++) {
            const u = i / (segCount - 1);
            const { pt, width } = getPointAndWidth(u, i, pts[i]);
            curvePts.push(pt);
            widths.push(width);
          }

          const tan = new THREE.Vector3();
          const view = new THREE.Vector3();
          const norm = new THREE.Vector3();

          for (let i = 0; i < segCount; i++) {
            const curr = curvePts[i];
            if (i < segCount - 1) tan.subVectors(curvePts[i + 1], curr);
            else tan.subVectors(curr, curvePts[i - 1]);
            if (tan.lengthSq() < 1e-6) tan.set(1, 0, 0);
            else tan.normalize();

            view.subVectors(camPos, curr).normalize();
            norm.crossVectors(tan, view).normalize();
            if (norm.lengthSq() < 1e-6) norm.set(0, 1, 0);

            const halfW = widths[i] * 0.5;
            const idx = i * 6;
            positions.array[idx + 0] = curr.x - norm.x * halfW;
            positions.array[idx + 1] = curr.y - norm.y * halfW;
            positions.array[idx + 2] = curr.z - norm.z * halfW;
            positions.array[idx + 3] = curr.x + norm.x * halfW;
            positions.array[idx + 4] = curr.y + norm.y * halfW;
            positions.array[idx + 5] = curr.z + norm.z * halfW;
          }
          positions.needsUpdate = true;
        };

        // Mint primary ribbon: undulating wave, broad glowing body
        updateRibbonGeometry(ribbonMint, (u, i, basePt) => {
          const spread = Math.sin(u * Math.PI);
          const waveY = Math.sin(u * 9.5 - animTime * 4.2) * 0.17 * spread;
          const waveZ = Math.cos(u * 8.0 - animTime * 3.4) * 0.15 * spread;
          const pt = new THREE.Vector3(basePt.x, basePt.y + waveY, basePt.z + waveZ);
          const width = (0.34 + 0.14 * spread) * Math.min(1.0, u * 3.5);
          return { pt, width };
        });

        // Intertwining secondary ribbon: out of phase helical twist
        updateRibbonGeometry(ribbonTwist, (u, i, basePt) => {
          const spread = Math.sin(u * Math.PI);
          const waveY = Math.sin(u * 9.5 - animTime * 4.2 + 2.4) * 0.19 * spread;
          const waveZ = Math.cos(u * 8.0 - animTime * 3.4 + 2.4) * 0.16 * spread;
          const pt = new THREE.Vector3(basePt.x, basePt.y + waveY, basePt.z + waveZ);
          const width = (0.26 + 0.10 * spread) * Math.min(1.0, u * 3.2);
          return { pt, width };
        });

        // Soft outer volumetric glow aura ribbon
        updateRibbonGeometry(ribbonAura, (u, i, basePt) => {
          const spread = Math.sin(u * Math.PI);
          const waveY = Math.sin(u * 9.5 - animTime * 4.2 + 1.2) * 0.08 * spread;
          const pt = new THREE.Vector3(basePt.x, basePt.y + waveY, basePt.z);
          const width = (0.62 + 0.22 * spread) * Math.min(1.0, u * 2.8);
          return { pt, width };
        });

        // High parabolic orange trajectory arc (Hawk-Eye tracker)
        const ballPos = ball.position;
        updateRibbonGeometry(arcOrange, (u) => {
          const arch = Math.sin(u * Math.PI) * 1.95 * Math.min(1.0, flight * 1.4);
          const x = THREE.MathUtils.lerp(contact.x, ballPos.x, u);
          const y = THREE.MathUtils.lerp(contact.y, ballPos.y, u) + arch;
          const z = THREE.MathUtils.lerp(contact.z, ballPos.z, u);
          const pt = new THREE.Vector3(x, y, z);
          const width = 0.095 * Math.min(1.0, u * 8.0) * Math.min(1.0, (1 - u) * 4.0 + 0.25);
          return { pt, width };
        });

        // Comet flare at the back of the ball
        cometFlare.position.set(ballPos.x - 0.14, ballPos.y - 0.08, ballPos.z + 0.06);
        cometFlare.scale.setScalar(0.95 + 0.15 * Math.sin(animTime * 6.0));
      }
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
