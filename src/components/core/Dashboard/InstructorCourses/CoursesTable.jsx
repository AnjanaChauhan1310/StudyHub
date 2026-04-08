import React from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table"

// import { setCourse, setEditCourse } from "../../../../slices/courseSlice"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
import { useState } from "react"
import { FaCheck } from "react-icons/fa"
import { FiEdit2 } from "react-icons/fi"
import { HiClock } from "react-icons/hi"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useNavigate } from "react-router-dom"
import convertSecondsToDuration from '../../../../utils/secToDurationFrontend'
import { formatDate } from "../../../../services/formatDate"
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../services/operations/courseDetailsAPI"
import { COURSE_STATUS } from "../../../../utils/constants"
import ConfirmationModal from "../../../common/ConfirmationModal"

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"

const CoursesTable = ({ courses, setCourses }) => {
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const TRUNCATE_LENGTH = 30

  const handleCourseDelete = async (courseId) => {
    setLoading(true);
    await deleteCourse({ courseId: courseId }, token)
    const result = await fetchInstructorCourses(token)
    if (result) {
      setCourses(result)
    }
    setConfirmationModal(null);
    setLoading(false)
  }

  function getDuration(course) {
    let totalDurationInSeconds = 0
    course.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })
    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
    return totalDuration
  }

  return (
    <>
      <div className="relative">
        {/* Mobile View Slider */}
        <div className="md:hidden group">
          {courses?.length === 0 ? (
            <div className="py-10 text-center text-2xl font-medium text-richblack-100">
              No courses found
            </div>
          ) : (
            <>
              <Swiper
                slidesPerView={1}
                spaceBetween={20}
                navigation={{
                  nextEl: ".swiper-button-next-custom",
                  prevEl: ".swiper-button-prev-custom",
                }}
                modules={[Navigation]}
                className="mySwiper rounded-xl overflow-hidden"
              >
                {courses?.map((course) => (
                  <SwiperSlide key={course._id}>
                    <div className="flex flex-col gap-4 bg-richblack-800 p-4 rounded-2xl border border-richblack-700">
                      <img
                        src={course?.thumbnail}
                        alt={course?.courseName}
                        className="h-[200px] w-full rounded-xl object-cover"
                      />
                      <div className="flex flex-col gap-2">
                        <p className="text-xl font-bold text-richblack-5">{course.courseName}</p>
                        <p className="text-sm text-richblack-300 line-clamp-2">{course.description}</p>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-xs text-richblack-100 italic">Created: {formatDate(course.createdAt)}</p>
                          {course.status === COURSE_STATUS.DRAFT ? (
                            <span className="flex items-center gap-1 rounded-full bg-richblack-700 px-2 py-0.5 text-[10px] text-pink-100">
                              <HiClock /> Drafted
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 rounded-full bg-richblack-700 px-2 py-0.5 text-[10px] text-yellow-100">
                              <FaCheck size={8} /> Published
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between border-t border-richblack-700 pt-3 mt-2">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-richblack-400 uppercase">Duration</span>
                            <span className="text-sm font-medium text-richblack-5">{getDuration(course)}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] text-richblack-400 uppercase">Price</span>
                            <span className="text-sm font-medium text-richblack-5 font-inter">₹{course.price}</span>
                          </div>
                          <div className="flex items-center gap-x-3">
                            <button
                              disabled={loading}
                              onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}
                              className="p-2 bg-richblack-700 rounded-lg text-caribbeangreen-300 hover:scale-110 transition-all"
                            >
                              <FiEdit2 size={18} />
                            </button>
                            <button
                              disabled={loading}
                              onClick={() => {
                                setConfirmationModal({
                                  text1: "Do you want to delete this course?",
                                  text2: "All the data related to this course will be deleted",
                                  btn1Text: !loading ? "Delete" : "Loading...",
                                  btn2Text: "Cancel",
                                  btn1Handler: !loading ? () => handleCourseDelete(course._id) : () => { },
                                  btn2Handler: !loading ? () => setConfirmationModal(null) : () => { },
                                })
                              }}
                              className="p-2 bg-richblack-700 rounded-lg text-pink-200 hover:scale-110 transition-all"
                            >
                              <RiDeleteBin6Line size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              {/* Custom Navigation */}
              <div className="swiper-button-prev-custom absolute top-[40%] -left-3 z-50 cursor-pointer text-richblack-5 bg-richblack-900/90 p-2 rounded-full border border-richblack-700 shadow-xl">
                <IoIosArrowBack />
              </div>
              <div className="swiper-button-next-custom absolute top-[40%] -right-3 z-50 cursor-pointer text-richblack-5 bg-richblack-900/90 p-2 rounded-full border border-richblack-700 shadow-xl">
                <IoIosArrowForward />
              </div>
            </>
          )}
        </div>

        {/* Desktop View Table */}
        <div className="hidden md:block">
          <Table className="rounded-xl border border-richblack-800 ">
            <Thead>
              <Tr className="flex gap-x-10 rounded-t-md border-b border-b-richblack-800 px-6 py-2">
                <Th className="flex-1 text-left text-sm font-medium uppercase text-richblack-100">
                  Courses
                </Th>
                <Th className="text-left text-sm font-medium uppercase text-richblack-100">
                  Duration
                </Th>
                <Th className="text-left text-sm font-medium uppercase text-richblack-100">
                  Price
                </Th>
                <Th className="text-left text-sm font-medium uppercase text-richblack-100">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {courses?.length === 0 ? (
                <Tr>
                  <Td className="py-10 text-center text-2xl font-medium text-richblack-100">
                    No courses found
                  </Td>
                </Tr>
              ) : (
                courses?.map((course) => (
                  <Tr
                    key={course._id}
                    className="flex gap-x-10 border-b border-richblack-800 px-6 py-8"
                  >
                    <Td className="flex flex-1 gap-x-4">
                      <img
                        src={course?.thumbnail}
                        alt={course?.courseName}
                        className="h-[148px] w-[220px] rounded-lg object-cover"
                      />
                      <div className="flex flex-col justify-between">
                        <p className="text-lg font-semibold text-richblack-5">
                          {course.courseName}
                        </p>
                        <p className="text-xs text-richblack-300">
                          {course.description.split(" ").length >
                            TRUNCATE_LENGTH
                            ? course.description
                              .split(" ")
                              .slice(0, TRUNCATE_LENGTH)
                              .join(" ") + "..."
                            : course.description}
                        </p>
                        <p className="text-[12px] text-white">
                          Created: {formatDate(course.createdAt)}
                        </p>
                        {course.status === COURSE_STATUS.DRAFT ? (
                          <div className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100">
                            <HiClock size={14} />
                            Drafted
                          </div>
                        ) : (
                          <div className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                            <span className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                              <FaCheck size={8} />
                            </span>
                            Published
                          </div>
                        )}
                      </div>
                    </Td>
                    <Td className="text-sm font-medium text-richblack-100">
                      {getDuration(course)}
                    </Td>
                    <Td className="text-sm font-medium text-richblack-100">
                      ₹{course.price}
                    </Td>
                    <Td className="text-sm font-medium text-richblack-100 ">
                      <button
                        disabled={loading}
                        onClick={() => {
                          navigate(`/dashboard/edit-course/${course._id}`)
                        }}
                        title="Edit"
                        className="px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
                      >
                        <FiEdit2 size={20} />
                      </button>
                      <button
                        disabled={loading}
                        onClick={() => {
                          setConfirmationModal({
                            text1: "Do you want to delete this course?",
                            text2:
                              "All the data related to this course will be deleted",
                            btn1Text: !loading ? "Delete" : "Loading...  ",
                            btn2Text: "Cancel",
                            btn1Handler: !loading
                              ? () => handleCourseDelete(course._id)
                              : () => { },
                            btn2Handler: !loading
                              ? () => setConfirmationModal(null)
                              : () => { },
                          })
                        }}
                        title="Delete"
                        className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                      >
                        <RiDeleteBin6Line size={20} />
                      </button>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </div>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}

export default CoursesTable