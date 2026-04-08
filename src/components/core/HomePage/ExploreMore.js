import React from 'react'
import {HomePageExplore} from '../../../data/homepage-explore'
import HighlightText from './HighlightText';
import { useState } from 'react';
import CourseCard from './CourseCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import { FreeMode } from 'swiper/modules';
const tabsName = [
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths",
];


const ExploreMore = () => {
    const [currentTab, setCurrentTab] = useState(HomePageExplore[0].tag)
    const [courses, setCourses] = useState(HomePageExplore[0].courses);
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

    const setMyCourse = (value) =>{
        setCurrentTab(value)
        const result= HomePageExplore.filter((course)=>course.tag === value)
        setCourses(result[0].courses)
        setCurrentCard(result[0].courses[0].heading)
    }

  return (
    <div>

      {/* Heading text */}
        <div className='text-4xl font-semibold text-center '>
        Unlock the 
        <HighlightText text={"Power of Code"} />
      </div>

      {/* Sub-Heading text */}
      <p className='text-center text-richblack-300  text-lg font-semibold mt-3 mb-3 lg:mb-0 '>
        Learn to build anything you can imagine
      </p>  

      {/*Tabs div */}
      <div className=' hidden lg:flex mt-5 shadow-custom  flex-row rounded-full
       bg-richblack-800 mb-5 border-richblack-100
      p-1'>
      {
        tabsName.map( (element, index) => {
            return (
                <div
                className={`text-[16px] flex flex-row items-center gap-9 font-medium 
                ${currentTab === element 
                ? "bg-richblack-900 text-richblack-5 font-medium"
                : "text-richblack-200" } rounded-full transition-all duration-200 cursor-pointer
                hover:bg-richblack-900 hover:text-richblack-5 px-8 py-2`}
                key={index}
                onClick={() => setMyCourse(element)}
                >
                    {element}
                </div>
            )
        })
      }
      </div>

      {/* Gap Div */}
      <div className='hidden lg:block lg:h-[200px]'></div>

      {/* course card slider for mobile and grid for desktop */}   
      <div className='lg:absolute lg:top-[100%] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[-50%] w-full mb-10 lg:mb-0'>
        {/* Mobile Slider */}
        <div className='lg:hidden'>
            <Swiper
                slidesPerView={1.1}
                spaceBetween={20}
                freeMode={true}
                modules={[FreeMode]}
                className="px-4"
            >
                {courses.map((element, index) => (
                    <SwiperSlide key={index}>
                        <CourseCard 
                            cardData={element}
                            currentCard={currentCard}
                            onClick={() => {setCurrentCard(element.heading)}}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>

        {/* Desktop Grid */}
        <div className='hidden lg:flex flex-row justify-between w-full gap-10'>
            {courses.map((element, index) => (
                <CourseCard 
                    key={index}
                    cardData={element}
                    currentCard={currentCard}
                    onClick={() => {setCurrentCard(element.heading)}}
                />
            ))}
        </div>
      </div>
    </div>
  )
}

export default ExploreMore