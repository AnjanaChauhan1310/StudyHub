import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import 'swiper/css/navigation';
import { Autoplay, FreeMode, Navigation, Pagination } from 'swiper/modules'
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"

import CourseCard from './Course_Card'

const CourseSlider = ({ Courses }) => {
    return (
        <div className="relative group px-2 md:px-0">
            {
                Courses?.length ? (
                    <>
                        <Swiper
                            slidesPerView={1.2}
                            spaceBetween={30}
                            loop={true}
                            centeredSlides={false}
                            navigation={{
                                nextEl: ".swiper-button-next-custom",
                                prevEl: ".swiper-button-prev-custom",
                            }}
                            modules={[FreeMode, Pagination, Navigation, Autoplay]}
                            breakpoints={{
                                640: {
                                    slidesPerView: 2,
                                    spaceBetween: 30,
                                },
                                1024: {
                                    slidesPerView: 3,
                                    spaceBetween: 40,
                                },
                            }}
                            autoplay={{
                                delay: 3500,
                                disableOnInteraction: false,
                            }}
                            className="max-h-[35rem] py-12 px-2 md:px-6 mySwiper"
                        >
                            {
                                Courses?.map((course, index) => (
                                    <SwiperSlide key={index}>
                                        <CourseCard course={course} Height={"h-[200px] md:h-[250px]"} />
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>

                        {/* Custom Navigation Arrows - High Visibility */}
                        <div className="swiper-button-prev-custom absolute top-[45%] -left-2 md:-left-6 z-50 cursor-pointer text-richblack-5 bg-richblack-800/90 backdrop-blur-md p-2 md:p-3 rounded-full border border-richblack-700 hover:bg-yellow-50 hover:text-richblack-900 transition-all duration-300 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.4)]">
                            <IoIosArrowBack className="text-xl md:text-2xl" />
                        </div>
                        <div className="swiper-button-next-custom absolute top-[45%] -right-2 md:-right-6 z-50 cursor-pointer text-richblack-5 bg-richblack-800/90 backdrop-blur-md p-2 md:p-3 rounded-full border border-richblack-700 hover:bg-yellow-50 hover:text-richblack-900 transition-all duration-300 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.4)]">
                            <IoIosArrowForward className="text-xl md:text-2xl" />
                        </div>
                    </>
                ) : (
                    <p className="text-xl text-richblack-5 text-center py-20 bg-richblack-800/50 rounded-2xl border border-richblack-700">No Course Found</p>
                )
            }
        </div>
    )
}

export default CourseSlider
