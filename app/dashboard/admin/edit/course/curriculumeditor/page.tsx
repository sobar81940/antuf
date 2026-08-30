"use client";

import CurriculumCourseEditor from "@/components/CurriculumCourseEditor/CurriculumCourseEditor";
import Sidebar from "@/components/sidebar/SideBar";
import { Suspense } from "react";

const CourseCreate = () => {
  return (
    <>
      <Sidebar />
      <Suspense fallback={<div>Loading editor...</div>}>
        <CurriculumCourseEditor />
      </Suspense>
    </>
  );
};

export default CourseCreate;
