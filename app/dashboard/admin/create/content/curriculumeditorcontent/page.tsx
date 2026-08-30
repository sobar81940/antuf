"use client";

import CurriculumEditor from "@/components/CurriculumEditor/CurriculumEditor";
import { Suspense } from "react";

const ContentCreate = () => {
  return (
    <>
      <Suspense fallback={<div>Loading curriculum editor...</div>}>
        <CurriculumEditor />
      </Suspense>
    </>
  );
};

export default ContentCreate;
