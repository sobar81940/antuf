"use client";

import { useState, useEffect, use } from "react";

import { v4 as uuidv4 } from "uuid";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import NotesIcon from "@mui/icons-material/Notes";
import PersonalVideoIcon from "@mui/icons-material/PersonalVideo";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import AddIcon from "@mui/icons-material/Add";
import DescriptionIcon from "@mui/icons-material/Description";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import hljs from "highlight.js";
import MarkdownIt from "markdown-it";
import MDEditor from "@uiw/react-md-editor";
import React from "react";
import ReactPlayer from "react-player";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { imageUpload } from "@/components/functions/Upload";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import Tab from "./Tab";

import {
  Box,
  Button,
  Typography,
  IconButton,
  TextField,
  Modal,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
} from "@mui/material";

import Sidebar from "@/components/sidebar/SideBar";
import { useSearchParams } from "next/navigation";
import { Height, Note } from "@mui/icons-material";

const ItemTypes = {
  SECTION: "section",
  LECTURE: "lecture",
};

const DraggableSection = ({ section, index, moveSection, children }) => {
  const [, ref] = useDrag({
    type: ItemTypes.SECTION,
    item: { index, sectionId: section._id },
  });

  const [, drop] = useDrop<{ index: number }>({
    accept: ItemTypes.SECTION,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveSection(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <Box
      ref={(node: HTMLDivElement | null) => {
        if (node) {
          ref(node);
          drop(node);
        }
      }}
      sx={{
        marginBottom: "16px",
      }}
    >
      {children}
    </Box>
  );
};

const DraggableLecture = ({
  lecture,
  sectionIndex,
  lectureIndex,
  moveLecture,
  children,
}) => {
  const [, ref] = useDrag({
    type: ItemTypes.LECTURE,
    item: {
      sectionIndex,
      lectureIndex,
    },
  });
  const [, drop] = useDrop<{ sectionIndex: number; lectureIndex: number }>({
    accept: ItemTypes.LECTURE,
    hover: (draggedItem) => {
      if (
        draggedItem.sectionIndex != sectionIndex ||
        draggedItem.lectureIndex != lectureIndex
      ) {
        moveLecture(
          draggedItem.sectionIndex,
          draggedItem.lectureIndex,
          sectionIndex,
          lectureIndex
        );
        draggedItem.sectionIndex = sectionIndex;
        draggedItem.lectureIndex = lectureIndex;
      }
    },
  });

  return (
    <Box
      ref={(node: HTMLDivElement | null) => {
        if (node) {
          ref(node);
          drop(node);
        }
      }}
      sx={{
        marginBottom: "8px",
      }}
    >
      {children}
    </Box>
  );
};

const CurriculumEditor = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const [curriculum, setCurriculum] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contenttitle, setContentTitle] = useState("");
  const [editSectionValue, setEditSectionValue] = useState("");
  const [editLectureValue, setEditLectureValue] = useState("");
  const [editing, setEditing] = useState(null);
  const [deletingLecture, setDeletingLecture] = useState(null);
  const [deletingSection, setDeletingSection] = useState("");
  const [videourl, setVideourl] = useState("");
  const [openVideoModal, setOpenVideoModal] = useState(false);

  const [sections, setSections] = useState([
    {
      _id: uuidv4(),
      title: "Introduction",
      lectures: [
        {
          _id: uuidv4(),
          title: "Topic A",
          content: "",
          videourl: "",
        },
      ],
    },
    {
      _id: uuidv4(),
      title: "Basic",
      lectures: [
        {
          _id: uuidv4(),
          title: "Topic B",
          content: "Topic B content",
          videourl: "https",
        },
        {
          _id: uuidv4(),
          title: "Topic B",
          content: "Topic B content",
          videourl: "https",
        },
        {
          _id: uuidv4(),
          title: "Topic B",
          content: "Topic B content",
          videourl: "https",
        },
      ],
    },
  ]);

  const fetchCurriculum = async (searchId) => {
    setLoading(true);
    const response = await fetch(
      `${process.env.API}/admin/singlecourse/${searchId}`
    );
    const data = await response.json();
    console.log("DATA FROM Fetch Curriculum fn----", data);
    setContentTitle(data?.title);
    setCurriculum(data?.sections || []);
    setLoading(false);
  };

  useEffect(() => {
    if (search) {
      fetchCurriculum(search);
    }
  }, [search]);

  const handleAddSection = async () => {
    const idindex = uuidv4();
    const newSection = {
      idindex,
      title: "New Section",
      lectures: [],
    };

    setCurriculum((prevSections) => [...prevSections, newSection]);

    const data = {
      newSection,
      search,
    };
    console.log("data sent from handle add section----", data);
    try {
      const response = await fetch(
        `${process.env.API}/admin/curriculumCourse/section`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const { newlyAddedSection } = await response.json();
        console.log("received in handleadd section", newlyAddedSection);
        setCurriculum((prevSections) =>
          prevSections.map((section) =>
            section.idindex === idindex ? newlyAddedSection : section
          )
        );
      } else {
        console.log("Failed to create section. Response from route", response);
        setCurriculum((prevSections) =>
          prevSections.filter((section) => section.idindex !== idindex)
        );
      }
    } catch (error) {
      console.log("ERROR inside handle add section fn------", error);
      setCurriculum((prevSections) =>
        prevSections.filter((section) => section?.idindex !== idindex)
      );
    }
  };

  const handleDeleteSection = async (sectionId) => {
    setDeletingSection(sectionId);
    const response = await fetch(
      `${process.env.API}/admin/curriculumCourse/section/${sectionId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(search),
      }
    );
    console.log("Response from route in handle delte section-----", response);
    if (response.ok) {
      setTimeout(() => {
        setCurriculum((prevSections) =>
          prevSections.filter((section) => section?._id !== sectionId)
        );
        setDeletingLecture(null);
      }, 2000);
    } else {
      console.log("Error from handle delete section------");
    }
  };

  const startEditing = (type, sectionIndex, LectureIndex = null) => {
    setEditing({ type, sectionIndex, LectureIndex });
    console.log("Thing sent to start edting fn-----", {
      type,
      sectionIndex,
      LectureIndex,
    });
    if (type === "section") {
      setEditSectionValue(curriculum[sectionIndex]?.title);
      console.log(
        "The val passed into setEditSectionValue state-----",
        curriculum[sectionIndex]?.title
      );
      console.log("editSectionValue state-----", editSectionValue);
    } else if (type === "lecture") {
      setEditLectureValue(
        curriculum[sectionIndex]?.lectures[LectureIndex]?.title
      );
    }
  };

  const handleCancelEdit = () => {
    setEditing(null);
    setEditSectionValue("");
    setEditLectureValue("");
  };

  const handleSaveEdit = async () => {
    //For Section part
    if (editing.type === "section") {
      const updatedSection = {
        ...curriculum[editing.sectionIndex],
        title: editSectionValue,
      };

      const data = {
        updatedSection,
        search,
      };

      const response = await fetch(
        `${process.env.API}/admin/curriculumCourse/section/${updatedSection?._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      console.log("update section", response);

      if (response.ok) {
        setCurriculum((prevSections) =>
          prevSections.map((section, index) =>
            index === editing.sectionIndex
              ? { ...section, title: editSectionValue }
              : section
          )
        );
      } else {
        console.log("Failed to update section");
      }
    }
    //For Lecture part
    else if (editing.type === "lecture") {
      const updatedSection = {
        ...curriculum[editing.sectionIndex]?.lectures[editing.LectureIndex],
        title: editLectureValue,
      };

      const sectionId = curriculum[editing.sectionIndex]?._id;

      const data = {
        updatedSection,
        sectionId,
        search,
      };

      console.log("save lecture", data);

      const response = await fetch(
        `${process.env.API}/admin/curriculumCourse/section/lecture/${
          curriculum[editing.sectionIndex]?.lectures[editing.LectureIndex]?._id
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        setCurriculum((prevSections) =>
          prevSections.map((section, sectionIndex) =>
            sectionIndex === editing.sectionIndex
              ? {
                  ...section,
                  lectures: section?.lectures?.map((Lecture, LectureIndex) =>
                    LectureIndex === editing.LectureIndex
                      ? { ...Lecture, title: editLectureValue }
                      : Lecture
                  ),
                }
              : section
          )
        );
      } else {
        console.log("Failed to update lecture");
      }
    }
    handleCancelEdit();
  };

  const handleAddLecture = async (sectionIndex) => {
    const lectureId = uuidv4();
    const newLecture = {
      idindex: lectureId,
      title: "",
    };
    const sectionId = curriculum[sectionIndex]?._id;
    setCurriculum((prevSections) =>
      prevSections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              lectures: [...section.lectures, newLecture],
            }
          : section
      )
    );

    const data = {
      newLecture,
      search,
      sectionId,
    };

    const response = await fetch(
      `${process.env.API}/admin/curriculumCourse/section/lecture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (response.ok) {
      const savedLecture = await response.json();

      setCurriculum((prevSections) =>
        prevSections.map((section, index) => {
          if (index !== sectionIndex) return section;
          return {
            ...section,
            lectures: section.lectures.map((lecture) =>
              lecture.idindex === lectureId ? savedLecture : lecture
            ),
          };
        })
      );
    } else {
      console.log("Failed to add lecture");
    }
  };

  const handleDeleteLecture = async (sectionIndex, lectureId) => {
    setDeletingLecture({ sectionIndex, lectureId });

    console.log("deletingxxxx", { sectionIndex, lectureId });

    const sectionId = curriculum[sectionIndex]?._id;

    const data = {
      sectionId,
      search,
    };

    const response = await fetch(
      `${process.env.API}/admin/curriculumCourse/section/lecture/${lectureId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (response.ok) {
      setTimeout(() => {
        setCurriculum((prevSections) =>
          prevSections.map((section, index) =>
            index === sectionIndex
              ? {
                  ...section,
                  lectures: section?.lectures.filter(
                    (lecture) => lecture._id !== lectureId
                  ),
                }
              : section
          )
        );

        setDeletingLecture(null);
      }, 2000);
    } else {
      console.error("Failed to delete lecture");
    }
  };

  const moveSection = async (fromIndex, toIndex) => {
    console.log("From Index to To Index", { fromIndex, toIndex });

    const updatedSections = [...curriculum];
    const [movedSection] = updatedSections.splice(fromIndex, 1);
    updatedSections.splice(toIndex, 0, movedSection);
    setCurriculum(updatedSections);

    try {
      await fetch(
        `${process.env.API}/admin/curriculumCourse/section/updateSectionOrder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sections: updatedSections, search }),
        }
      );
    } catch (error) {
      console.log("error from moveSection fn-------", error);
    }
  };

  const moveLecture = async (
    fromSectionIndex,
    fromLectureIndex,
    toSectionIndex,
    toLectureIndex
  ) => {
    console.log("Data sent to moveLecture fn-----", {
      fromSectionIndex,
      fromLectureIndex,
      toSectionIndex,
      toLectureIndex,
    });

    const updatedSections = [...curriculum];
    const [movedLecture] = updatedSections[fromSectionIndex].lectures.splice(
      fromLectureIndex,
      1
    );

    updatedSections[toSectionIndex].lectures.splice(
      toLectureIndex,
      0,
      movedLecture
    );

    setCurriculum(updatedSections);
    try {
      await fetch(
        `${process.env.API}/admin/curriculumCourse/section/lecture/updateLectureOrder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sections: updatedSections,
            search,
          }),
        }
      );
    } catch (error) {
      console.log(
        "error updating lecture order from moveLecture fn------",
        error
      );
    }
  };

  const [openModal, setOpenModal] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [content, setContent] = useState("");
  const [currentSectionIndex, setCurrentSectionIndex] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoURL, setVideoURL] = useState("");
  const [buffer, setBuffer] = useState(10);

  const handleOpenModal = (Lecture, sectionIndex) => {
    setCurrentSectionIndex(sectionIndex);
    setCurrentLecture(Lecture);
    setContent(Lecture?.content || "");
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentLecture(null);
    setContent("");
    setCurrentSectionIndex(null);
  };

  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: (str, lang) => {
      const language = lang && hljs.getLanguage(lang) ? lang : "js";
      try {
        const highlightedCode = hljs.highlight(language, str, true).value;
        return `<pre class="hljs"><code>${highlightedCode}</code></pre>`;
      } catch (error) {
        return ""; // Return an empty string if highlighting fails
      }
    },
  });

  const handleSaveContent = async () => {
    const sectionId = curriculum[currentSectionIndex]?._id;
    const lecturebody = {
      ...currentLecture,
      content,
    };
    const data = {
      lecturebody,
      sectionId,
      search,
    };
    const response = await fetch(
      `${process.env.API}/admin/curriculumCourse/section/lecture/content/${lecturebody?._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    if (response.ok) {
      setCurriculum((prevSections) =>
        prevSections.map((section) => ({
          ...section,
          lectures: section?.lectures.map((Lecture) => {
            Lecture?._id === currentLecture?._id
              ? {
                  ...Lecture,
                  content,
                }
              : Lecture;
          }),
        }))
      );
    } else {
      console.log("Failed to update");
    }
    handleCloseModal();
  };

  const handleOpenVideoModal = (Lecture, sectionIndex) => {
    setCurrentSectionIndex(sectionIndex);
    setCurrentLecture(Lecture);
    setVideourl(Lecture.videourl || "");
    setOpenVideoModal(true);
  };

  const handleCloseVideoModal = () => {
    setOpenVideoModal(false);
    setCurrentLecture(null);
    setVideourl("");
    setCurrentSectionIndex(null);
  };

  const handleSaveVideoContent = async () => {
    setFile(null);
    const sectionId = curriculum[currentSectionIndex]?._id;
    const lecturebody = {
      ...currentLecture,
      videourl,
    };
    const data = {
      lecturebody,
      sectionId,
      search,
    };
    const response = await fetch(
      `${process.env.API}/admin/curriculumCourse/section/lecture/content/${lecturebody?._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    if (response.ok) {
      setCurriculum((prevSections) =>
        prevSections.map((section) => ({
          ...section,
          lectures: section?.lectures.map((Lecture) => {
            Lecture?._id === currentLecture?._id
              ? {
                  ...Lecture,
                  videourl,
                }
              : Lecture;
          }),
        }))
      );
    } else {
      console.log("Failed to update video content");
    }
    handleCloseVideoModal();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const maxSizeInMB = 100; // Set max file size in MB

    if (selectedFile && selectedFile.size > maxSizeInMB * 1024 * 1024) {
      alert(
        `File size exceeds ${maxSizeInMB}MB. Please upload a smaller file.`
      );
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setVideoURL("");
    setUploadProgress(0);
    setBuffer(10); // Reset buffer on new file
  };

  const handleRemoveVideo = () => {
    setFile(null);
    // setFormData((prev) => ({
    //   ...prev,
    //   videoUrl: "", // Set it to empty string, not null
    // }));
    setVideoURL("");
    setUploadProgress(0);
    setBuffer(10); // Reset buffer when removing video
  };

  const handleUpload = async () => {
    if (!file) {
      console.log("Please select a file to upload.");
      return;
    }

    const formDataToUpload = new FormData();
    formDataToUpload.append("file", file);
    formDataToUpload.append("upload_preset", "ml_default");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`,
        formDataToUpload,
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadProgress(progress);
            if (progress % 5 === 0 && buffer < 100) {
              setBuffer(buffer + 1 + Math.random() * 10); // Simulate buffering
            }
          },
        }
      );

      setVideourl(response.data.secure_url);
      setVideoURL(response.data.secure_url);
      setUploadProgress(0);
      setBuffer(100); // Set buffer to 100 once upload is successful
      console.log("Upload successful!");
    } catch (error) {
      alert(error);
      console.log("Error uploading video:", error.response || error.message);
      console.log("Upload failed. Please try again.");
    }
  };

  return (
    <>
      <Box
        sx={{
          mt: 0,
          padding: "16px",
          background: "linear-gradient(90deg, #8A12FC, #ff0080)",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
          textAlign: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#fff",
            textTransform: "uppercase",
            letterSpacing: "1.5px",
          }}
        >
          {contenttitle}
        </Typography>
      </Box>

      <Tab />

      <DndProvider backend={HTML5Backend}>
        <Box
          sx={{
            width: "100%",
            maxWidth: "800px",
            margin: "0 auto",
            padding: "16px",
            backgroundColor: "#212121",
            border: "1px solid #E0E0E0",
          }}
        >
          {curriculum &&
            curriculum?.map((section, sectionIndex) => (
              <DraggableSection
                key={section?.idindex}
                section={section}
                index={sectionIndex}
                moveSection={moveSection}
              >
                <Box
                  key={section?._id}
                  sx={{
                    backgroundColor:
                      deletingSection === section?._id ? "red" : "#212121",
                    border: "1px solid #E0E0E0",
                    padding: "16px",
                    borderRadius: "4px",
                    marginBottom: "16px",
                  }}
                >
                  {/* Combined title and icons in one horizontal row */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <DescriptionIcon
                        sx={{
                          marginRight: "8px",
                          color: "#FFFF",
                        }}
                      />
                      Section {sectionIndex + 1} : {section?.title}
                    </Typography>

                    <Box>
                      <IconButton
                        onClick={() => startEditing("section", sectionIndex)}
                      >
                        <EditIcon
                          sx={{
                            color: "#FFF",
                          }}
                        />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteSection(section?._id)}
                      >
                        <DeleteIcon
                          sx={{
                            color: "#FFF",
                          }}
                        />
                      </IconButton>
                    </Box>
                  </Box>

                  {editing &&
                    editing.type === "section" &&
                    editing.sectionIndex === sectionIndex && (
                      <Box
                        sx={{
                          marginTop: "16px",
                        }}
                      >
                        <TextField
                          fullWidth
                          value={editSectionValue}
                          onChange={(e) => setEditSectionValue(e.target.value)}
                          sx={{
                            marginBottom: "8px",
                            backgroundColor: "#212121",
                            borderRadius: "4px",
                            color: "#fff",
                            input: { color: "white" },

                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "#fff",
                              },
                              "&:hover fieldset": {
                                borderColor: "#fff",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#fff",
                              },
                            },
                          }}
                        />

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Button
                            variant="contained"
                            onClick={handleCancelEdit}
                            sx={{
                              marginRight: "8px",
                              textTransform: "none",
                              border: "1px solid #E0E0E0",
                              color: "#FFF",
                              backgroundColor: "#000",
                            }}
                          >
                            Cancel
                          </Button>

                          <Button
                            variant="contained"
                            onClick={handleSaveEdit}
                            sx={{
                              textTransform: "none",
                              border: "1px solid #E0E0E0",
                              color: "#FFF",
                              backgroundColor: "#000",
                            }}
                          >
                            Save
                          </Button>
                        </Box>
                      </Box>
                    )}

                  <Box
                    sx={{
                      marginTop: "16px",
                    }}
                  >
                    {section?.lectures?.map((Lecture, LectureIndex) => (
                      <React.Fragment key={Lecture?._id || Lecture?.idindex}>
                        <DraggableLecture
                          key={Lecture?.idindex}
                          sectionIndex={sectionIndex}
                          lectureIndex={LectureIndex}
                          lecture={Lecture}
                          moveLecture={moveLecture}
                        >
                          <Box
                            key={Lecture?._id || Lecture?.idindex}
                            sx={{
                              backgroundColor:
                                deletingLecture?.sectionIndex === sectionIndex &&
                                deletingLecture?.lectureId === Lecture?._id
                                  ? "red"
                                  : "#333",
                              padding: "16px",
                              borderRadius: "4px",
                              marginBottom: "8px",
                              border: "1px solid #E0E0E0",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Typography
                                sx={{
                                  color: "#fff",
                                  fontWeight: "bold",
                                  marginBottom: "8px",
                                }}
                              >
                                Lecture {LectureIndex + 1} : {Lecture?.title}
                              </Typography>

                              <Box>
                                <IconButton
                                  onClick={() =>
                                    handleOpenVideoModal(Lecture, sectionIndex)
                                  }
                                >
                                  {Lecture?.videourl ? (
                                    <OndemandVideoIcon
                                      sx={{
                                        color: "#fff",
                                      }}
                                    />
                                  ) : (
                                    <PersonalVideoIcon
                                      sx={{
                                        color: "#fff",
                                      }}
                                    />
                                  )}
                                </IconButton>

                                <IconButton
                                  onClick={() =>
                                    startEditing(
                                      "lecture",
                                      sectionIndex,
                                      LectureIndex
                                    )
                                  }
                                >
                                  <EditIcon
                                    sx={{
                                      color: "#fff",
                                    }}
                                  />
                                </IconButton>

                                <IconButton
                                  onClick={() =>
                                    handleDeleteLecture(sectionIndex, Lecture._id)
                                  }
                                >
                                  <DeleteIcon
                                    sx={{
                                      color: "#fff",
                                    }}
                                  />
                                </IconButton>
                              </Box>
                            </Box>

                            {/* Lecture editing below the lecture title */}
                            {editing &&
                              editing.type === "lecture" &&
                              editing.sectionIndex === sectionIndex &&
                              editing.LectureIndex === LectureIndex && (
                                <Box sx={{ marginTop: "16px" }}>
                                  <TextField
                                    fullWidth
                                    value={editLectureValue || ""}
                                    onChange={(e) =>
                                      setEditLectureValue(e.target.value)
                                    }
                                    sx={{
                                      marginBottom: "8px",
                                      backgroundColor: "#212121",
                                      borderRadius: "4px",
                                      color: "#fff",
                                      input: { color: "white" },
                                      "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                          borderColor: "#fff",
                                        },
                                        "&:hover fieldset": {
                                          borderColor: "#fff",
                                        },
                                        "&.Mui-focused fieldset": {
                                          borderColor: "#fff",
                                        },
                                      },
                                    }}
                                  />

                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                    }}
                                  ></Box>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <Button
                                      variant="contained"
                                      onClick={handleCancelEdit}
                                      sx={{
                                        marginRight: "8px",
                                        textTransform: "none",
                                        border: "1px solid #E0E0E0",
                                        color: "#FFFFFF",
                                        backgroundColor: "#000",
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      variant="contained"
                                      onClick={handleSaveEdit}
                                      sx={{
                                        color: "#FFFFFF",
                                        backgroundColor: "#000",
                                        textTransform: "none",
                                        border: "1px solid #E0E0E0",
                                      }}
                                    >
                                      Save Lecture
                                    </Button>
                                  </Box>
                                </Box>
                              )}
                          </Box>
                        </DraggableLecture>
                        {LectureIndex < section.lectures.length - 1 && (
                          <Box sx={{ height: 8 }} /> // or use <Divider /> for a line
                        )}
                      </React.Fragment>
                    ))}

                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => handleAddLecture(sectionIndex)}
                      sx={{
                        marginTop: "8px",
                        color: "#ffff",
                        backgroundColor: "#000",
                        textTransform: "none",
                      }}
                    >
                      Add Lecture
                    </Button>
                  </Box>
                </Box>
              </DraggableSection>
            ))}

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddSection}
            sx={{
              marginTop: "16px",
              color: "#ffff",
              backgroundColor: "#000",
              textTransform: "none",
            }}
          >
            Add Section
          </Button>

          <Modal open={openModal} onClose={handleCloseModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                width: "80%",
                bgcolor: "#212121",
                border: "2px solid #000",
                p: 4,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                }}
              >
                Edit Lecture {currentLecture?.title}
              </Typography>

              <MDEditor
                value={content}
                height={400}
                onChange={(val) => setContent(val || "")}
                preview="edit"
                data-color-mode="dark"
              />

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={handleCloseModal}
                  sx={{ marginRight: "8px" }}
                >
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleSaveContent}
                  sx={{ color: "#fff", backgroundColor: "#000" }}
                >
                  Save
                </Button>
              </Box>
            </Box>
          </Modal>

          {/* Modal for editing lecture video content */}
          <Modal open={openVideoModal} onClose={handleCloseVideoModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "80%",
                maxHeight: "90vh",
                overflowY: "auto",
                bgcolor: "#212121",
                border: "2px solid #000",
                // boxShadow: 24,
                p: 4,
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Edit Lecture{"   "}
                {currentLecture?.title}
              </Typography>

              <Card
                sx={{
                  maxWidth: 900,
                  mx: "auto",
                  mt: 4,
                  p: 2,

                  borderRadius: 2,
                  bgcolor: "#212121",
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography variant="h4" align="center" gutterBottom>
                    🎥 Video Uploader
                  </Typography>

                  <Button
                    variant="outlined"
                    color="primary"
                    component="label"
                    sx={{
                      width: "100%",
                      p: 2,
                      borderRadius: 1,
                      mt: 2,
                      textTransform: "none",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "1px solid #ddd",
                      fontSize: "1rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {file ? file.name : "Select Video"}
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      hidden
                    />
                  </Button>

                  {uploadProgress > 0 && (
                    <Box
                      sx={{
                        mt: 3,
                        position: "relative",
                        width: "100%",
                        height: 30,
                        borderRadius: 4,
                        backgroundColor: "#122121",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <LinearProgress
                        variant="buffer"
                        value={uploadProgress}
                        valueBuffer={buffer}
                        sx={{
                          height: "100%",
                          borderRadius: 4,
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: "#8A12FC",
                          },
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: "50%",
                          transform: "translateX(-50%)",
                          color: "#fff",
                          fontWeight: "bold",
                          lineHeight: "30px",
                        }}
                      >
                        {uploadProgress}%
                      </Typography>
                    </Box>
                  )}

                  {videoURL && (
                    <Box sx={{ mt: 3, position: "relative" }}>
                      <Typography variant="subtitle1">
                        Uploaded Video:
                      </Typography>
                      <video
                        src={videoURL}
                        controls
                        style={{
                          width: "100%",
                          borderRadius: "8px",
                          marginTop: "10px",
                          boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                        }}
                      />
                      <IconButton
                        aria-label="remove video"
                        onClick={handleRemoveVideo}
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          background: "rgba(240, 13, 13, 0.8)",
                          boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                          "&:hover": { background: "red" },
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  )}
                </CardContent>

                <CardActions sx={{ justifyContent: "center" }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleUpload}
                    disabled={!file}
                    sx={{
                      textTransform: "capitalize",
                      px: 3,
                      py: 1.5,
                      mt: 2,
                      borderRadius: 2,
                      backgroundColor: "#8A12FC",
                    }}
                  >
                    Upload Video
                  </Button>
                </CardActions>
              </Card>

              {currentLecture && currentLecture.videourl ? (
                <Box
                  sx={{
                    width: "100%",
                    height: "80vh",
                    padding: "16px",
                    backgroundColor: "#212121",
                  }}
                >
                  <ReactPlayer
                    src={currentLecture?.videourl}
                    width="100%"
                    height="100%"
                    controls
                    light={true}
                    playing={false}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    padding: "16px",
                    textAlign: "center",
                  }}
                >
                  <p>No video for this url</p>
                </Box>
              )}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 3,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleCloseVideoModal}
                  sx={{ marginRight: "8px" }}
                >
                  Cancel
                </Button>

                <Button
                  variant="outlined"
                  onClick={handleSaveVideoContent}
                  sx={{ color: "#fff", backgroundColor: "#000" }}
                >
                  Save
                </Button>
              </Box>
            </Box>
          </Modal>
        </Box>
      </DndProvider>

      <Sidebar />
    </>
  );
};
export default CurriculumEditor;
