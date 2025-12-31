gsap.registerPlugin(
    ScrollTrigger,
    ScrollSmoother,
    SplitText,
    TextPlugin,
    DrawSVGPlugin
  );

let tl = gsap.timeline();

gsap.set("#title-cnt", { autoAlpha: 1 });

let split = SplitText.create("#title-cnt", {
    type: "chars",
});

gsap.fromTo(split.chars, 
    { 
        yPercent: 200,
        opacity: 0,
    },
    { 
        yPercent: 0,
    delay:0.2,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: "power4.out",
        // yoyo:true,
        // repeat:-1
    }
);

gsap.to("#title-hr",{
    x:0,
    duration:1
    })
// gsap.fromTo("#title-cnt",{
//     opacity:0,
//     display:"none",
//     duration:2,
//     delay:5,
//     y:20
// },{
//     scale:1,
//     opacity:1,
//     display:"block",
// });

// gsap.fromTo(".home-card",{
//     scale:0.8,
//     opacity:0.6,
//     y:20,
//     delay:1
// },{
//     scale:1,
//     opacity:1,
//     y:0,
//     scrollTrigger:{
//         trigger:".home-card",
//         start:"top 80%",
//         end:"bottom 80%",
//         invalidateOnRefresh: true,
//         scrub:2,
//         markers:true,
//         // pin:true
//     }
// });



tl.from(".title-cnt-i",{
    y : -200,
    duration:2
})