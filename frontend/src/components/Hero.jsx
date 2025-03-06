import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import slideshow1 from "../assets/slideshow_1.png";
import slideshow2 from "../assets/slideshow_2.png";
import slideshow3 from "../assets/slideshow_3.png";
import slideshow4 from "../assets/slideshow_4.png";

const Hero = () => {
  const heroImages = [slideshow1, slideshow2, slideshow3, slideshow4];

  // Cấu hình slider
  const settings = {
    dots: false, // Hiển thị dấu chấm bên dưới
    infinite: true, // Lặp lại slider
    speed: 500, // Tốc độ chuyển slide (ms)
    slidesToShow: 1, // Hiển thị 1 ảnh mỗi lần
    slidesToScroll: 1, // Cuộn từng slide một
    autoplay: true, // Tự động chạy slide
    autoplaySpeed: 3000, // Thời gian tự động đổi slide (ms)
    arrows: false, // Ẩn nút điều hướng
  };

  return (
    <div className="relative w-full h-screen">
      <Slider {...settings}>
        {heroImages.map((img, index) => (
          <div key={index} className="relative w-full h-full">
            <img
              src={img}
              alt={`Hero ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Hero;
