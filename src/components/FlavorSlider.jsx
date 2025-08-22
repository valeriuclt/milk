// import { useGSAP } from "@gsap/react";
import { flavorlists } from "../constants";
// import gsap from "gsap";
// import { useRef } from "react";
// import { useMediaQuery } from "react-responsive";

 


// const FlavorSlider = () => {
//   const sliderRef = useRef();

//   const isTablet = useMediaQuery({ query: "(max-width: 1024px)", });

//   useGSAP(() => {
    
//       //  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
//     const scrollAmount = sliderRef.current.scrollWidth - window.innerWidth;



//     if (!isTablet) {
//       const tl = gsap.timeline({
//         scrollTrigger: {
//           trigger: ".flavor-section",
//           start: "2% top",
//           end: `+=${scrollAmount + 1500}px`,
//           scrub: true,
//           pin: true,
//         },
//       });

//       tl.to(".flavor-section", {
//         x: `-${scrollAmount + 1500}px`,
//         ease: "power1.inOut",
//       });
//     }

//     const titleTl = gsap.timeline({
//       scrollTrigger: {
//         trigger: ".flavor-section",
//         start: "top top",
//         end: "bottom 80%",
//         scrub: true,
//       },
//     });

//     titleTl
//       .to(".first-text-split", {
//         xPercent: -30,
//         ease: "power1.inOut",
//       })
//       .to(
//         ".flavor-text-scroll",
//         {
//           xPercent: -22,
//           ease: "power1.inOut",
//         },
//         "<"
//       )
//       .to(
//         ".second-text-split",
//         {
//           xPercent: -10,
//           ease: "power1.inOut",
//         },
//         "<"
//       );
//   });

//   return (
//     <div ref={sliderRef} className="slider-wrapper">
//       <div className="flavors">
//         {flavorlists.map((flavor) => (
//           <div
//             key={flavor.name}
//             className={`relative z-30 lg:w-[50vw] w-96 lg:h-[70vh] md:w-[90vw] md:h-[50vh] h-80 flex-none ${flavor.rotation}`}
//           >
//             <img
//               src={`/images/${flavor.color}-bg.svg`}
//               alt=""
//               className="absolute bottom-0"
//             />

//             <img
//               src={`/images/${flavor.color}-drink.webp`}
//               alt=""
//               className="drinks"
//             />

//             <img
//               src={`/images/${flavor.color}-elements.webp`}
//               alt=""
//               className="elements"
//             />

//             <h1>{flavor.name}</h1>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FlavorSlider;

import { useRef, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FlavorSlider = () => {
  const sliderRef = useRef();
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  
  const [currentFlavor, setCurrentFlavor] = useState(0);

  // Pentru mobile, folosim un scroll handler simplu în loc de GSAP
  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const flavorElements = document.querySelectorAll('.flavor-item');
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      flavorElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        
        if (elementCenter > 0 && elementCenter < windowHeight) {
          setCurrentFlavor(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  useGSAP(() => {
    // Doar pe desktop folosim ScrollTrigger
    if (!isTablet && sliderRef.current) {
      const scrollAmount = sliderRef.current.scrollWidth - window.innerWidth;
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".flavor-section",
          start: "2% top",
          end: `+=${scrollAmount + 1500}px`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          // Adăugăm un scoped context pentru a evita conflictele
          id: "flavor-slider-main",
        },
      });

      tl.to(".flavor-section", {
        x: `-${scrollAmount + 1500}px`,
        ease: "power1.inOut",
      });

      // Animația pentru text pe desktop
      const titleTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".flavor-section",
          start: "top top",
          end: "bottom 80%",
          scrub: true,
          id: "flavor-slider-text",
        },
      });

      titleTl
        .to(".first-text-split", {
          xPercent: -30,
          ease: "power1.inOut",
        })
        .to(
          ".flavor-text-scroll",
          {
            xPercent: -22,
            ease: "power1.inOut",
          },
          "<"
        )
        .to(
          ".second-text-split",
          {
            xPercent: -10,
            ease: "power1.inOut",
          },
          "<"
        );
    }
  }, [isTablet]);

  return (
    <div ref={sliderRef} className="slider-wrapper">
      <div className="flavors">
        {flavorlists.map((flavor, index) => (
          <div
            key={flavor.name}
            className={`flavor-item relative z-30 lg:w-[50vw] w-96 lg:h-[70vh] md:w-[90vw] md:h-[50vh] h-80 flex-none ${flavor.rotation} ${
              isMobile && index === currentFlavor ? 'active-flavor' : ''
            }`}
            style={{
              marginBottom: isMobile ? '2rem' : '0',
              // Pe mobile, adăugăm o tranziție smooth
              transition: isMobile ? 'transform 0.3s ease, opacity 0.3s ease' : 'none',
              transform: isMobile && index !== currentFlavor ? 'scale(0.95)' : 'scale(1)',
              opacity: isMobile && Math.abs(index - currentFlavor) > 1 ? 0.7 : 1,
            }}
          >
            <img
              src={`/images/${flavor.color}-bg.svg`}
              alt=""
              className="absolute bottom-0"
              loading={index > 2 ? "lazy" : "eager"}
            />
            <img
              src={`/images/${flavor.color}-drink.webp`}
              alt=""
              className="drinks"
              loading={index > 2 ? "lazy" : "eager"}
            />
            <img
              src={`/images/${flavor.color}-elements.webp`}
              alt=""
              className="elements"
              loading={index > 2 ? "lazy" : "eager"}
            />
            <h1>{flavor.name}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlavorSlider;