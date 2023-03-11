import { useEffect, useRef } from "react";
import "./styles.css";

export default function ImagesSlider({ images }) {
  const imageTrackRef = useRef();

  useEffect(() => {
    if (!imageTrackRef.current) return;
    imageTrackRef.current.addEventListener("mousedown", (e) => {
      imageTrackRef.current.mouseDownAt = e.clientX;
    });

    imageTrackRef.current.addEventListener("mouseup", (e) => {
      const ref = imageTrackRef.current;
      ref.mouseDownAt = "0";
      ref.prevPercentage = ref.currentPrencentage;
    });

    imageTrackRef.current.addEventListener("mousemove", (e) => {
      const ref = imageTrackRef.current;
      const { mouseDownAt, prevPercentage } = ref;

      if (mouseDownAt === "0") return;

      const mouseCurrentposition = parseFloat(mouseDownAt) - e.clientX;
      const sliderWidth = window.innerWidth / 2;

      const percentage = (mouseCurrentposition / sliderWidth) * -100;

      const nextPercentageUnconstrained =
        parseFloat(prevPercentage ?? 0) + percentage;

      const nextPercentage = Math.max(
        Math.min(nextPercentageUnconstrained, 0),
        -100
      );
      ref.currentPrencentage = nextPercentage;

      const imagesElements = ref.querySelectorAll(".image");
      for (let i = 0; i < imagesElements.length; i++) {
        const imageElement = imagesElements[i];
        imageElement.animate(
          {
            objectPosition: `${nextPercentage + 100}% 50%`
          },
          {
            duration: 1200,
            fill: "forwards"
          }
        );
      }
      ref.animate(
        {
          transform: `translate(${nextPercentage}%,-50%)`
        },
        {
          duration: 1200,
          fill: "forwards"
        }
      );
    });
  }, []);

  return (
    <div
      ref={imageTrackRef}
      data-is-dragging="false"
      data-mouse-down-at="0"
      data-prev-precentage="0"
      data-current-prencentage="0"
      className="image-track"
    >
      {images.map((image, index) => (
        <div className="imageCard">
          <img draggable="false" className="image" src={image} />
        </div>
      ))}
    </div>
  );
}
