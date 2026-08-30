"use client";
import { useState, useEffect } from "react";
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
import MDEditor, { commands } from "@uiw/react-md-editor";
import React from "react";
import ReactPlayer from "react-player";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { imageUpload } from "@/components/functions/Upload";
import {
    Box,
    Button,
    Typography,
    IconButton,
    TextField,
    Modal,

} from "@mui/material";

import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/sidebar/SideBar";
import { toast } from "react-toastify";
const ItemTypes = {
    SECTION: "section",
    LECTURE: "lecture",
};

const ArticleEditor = () => {
    const searchParams = useSearchParams();
    const search = searchParams.get("search");
    const [article, setArticle] = useState([]);
    const [loading, setLoading] = useState(false);
    const [contenttitle, setContentTitle] = useState("");
    const [editSectionValue, setEditSectionValue] = useState("");
    const [editLectureValue, setEditLectureValue] = useState("");
    const [editing, setEditing] = useState(null);
    const [deletingLecture, setDeletingLecture] = useState(null);
    const [deletingSection, setDeletingSection] = useState("");
    const [videourl, setVideourl] = useState("");
    const [openVideoModal, setOpenVideoModal] = useState(false);
    // const [sections, setSections] => useState([

    //     {
    //         _id: uuidv4(),
    //         title: "Basic",
    //         lectures: [
    //             {
    //                 _id: uuidv4(),
    //                 title: "Topic A",
    //                 content: "Topic B content",
    //                 videourl: "https",
    //             },
    //             {
    //                 _id: uuidv4(),
    //                 title: "Topic B",
    //                 content: "Topic B content",
    //                 videourl: "https",
    //             },
    //             {
    //                 _id: uuidv4(),
    //                 title: "Topic C",
    //                 content: "Topic B content",
    //                 videourl: "https",
    //             },
    //         ],
    //     },
    //     {
    //         _id: uuidv4(),
    //         title: "Start",
    //         lectures: [
    //             {
    //                 _id: uuidv4(),
    //                 title: "Topic A",
    //                 content: "Topic B content",
    //                 videourl: "https",
    //             },
    //             {
    //                 _id: uuidv4(),
    //                 title: "Topic B",
    //                 content: "Topic B content",
    //                 videourl: "https",
    //             },
    //             {
    //                 _id: uuidv4(),
    //                 title: "Topic C",
    //                 content: "Topic B content",
    //                 videourl: "https",
    //             },
    //         ],
    //     },
    // ]);


    const fetchArticle = async (searchId) => {
        setLoading(true);
        const response = await fetch(
            `${process.env.API}/admin/singlearticle/${searchId}`
        );
        const data = await response.json();
        console.log("DATA FROM Fetch Article fn----", data);
        setContentTitle(data?.title);
        setArticle(data?.sections || []);
        setLoading(false);

    }
    //  const handleAddLecture = async (sectionIndex) => {
    //     alert("Add Lecture Clicked");
    //     const lectureId = uuidv4();
    //     const newLecture = {
    //       idindex: lectureId,
    //       title: "New Lecture",
    //     };
    //     // const sectionId = curriculum[sectionIndex]?._id;
    //     // setCurriculum((prevSections) =>
    //     //   prevSections.map((section, index) =>
    //     //     index === sectionIndex
    //     //       ? {
    //     //           ...section,
    //     //           lectures: [...section.lectures, newLecture],
    //     //         }
    //     //       : section
    //     //   )
    //     // );

    //     // const data = {
    //     //   newLecture,
    //     //   search,
    //     //   sectionId,
    //     // };

    //     // const response = await fetch(
    //     //   `${process.env.API}/admin/Curriculum/section/lecture`,
    //     //   {
    //     //     method: "POST",
    //     //     headers: {
    //     //       "Content-Type": "application/json",
    //     //     },
    //     //     body: JSON.stringify(data),
    //     //   }
    //     // );

    //     if (response.ok) {
    //       const savedLecture = await response.json();

    //       setArticle((prevSections) =>
    //         prevSections.map((section, index) => {
    //           if (index !== sectionIndex) return section;
    //           return {
    //             ...section,
    //             lectures: section.lectures.map((lecture) =>
    //               lecture.idindex === lectureId ? savedLecture : lecture
    //             ),
    //           };
    //         })
    //       );
    //     } else {
    //       console.log("Failed to add lecture");
    //     }
    //   };
    useEffect(() => {
        if (search) {
            fetchArticle(search);
        }
    }, [search]);

    const handleAddSection = async () => {
        toast.info("Adding new Paragraph...");
        const idindex = uuidv4();
        const newSection = {
            idindex,
            title: "New Section",
            lectures: [],
        };

        setArticle((prevSections) => [...prevSections, newSection]);

        const data = {
            newSection,
            search,
        };
        console.log("data sent from handle add section----", data);
        try {
            const response = await fetch(
                `${process.env.API}/admin/Article/section`,
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
                setArticle((prevSections) =>
                    prevSections.map((section) =>
                        section.idindex === idindex ? newlyAddedSection : section
                    )
                );
            } else {
                console.log("Failed to create section. Response from route", response);
                setArticle((prevSections) =>
                    prevSections.filter((section) => section.idindex !== idindex)
                );
            }
        } catch (error) {
            console.log("ERROR inside handle add section fn------", error);
            setArticle((prevSections) =>
                prevSections.filter((section) => section?.idindex !== idindex)
            );
        }
    };
    const handleDeleteSection = async (sectionId) => {
        setDeletingSection(sectionId);
        const response = await fetch(
            `${process.env.API}/admin/Article/section/${sectionId}`,
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
                setArticle((prevSections) =>
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
            setEditSectionValue(article[sectionIndex]?.title);
            console.log(
                "The val passed into setEditSectionValue state-----",
                article[sectionIndex]?.title
            );
            console.log("editSectionValue state-----", editSectionValue);
        } else if (type === "lecture") {
            setEditLectureValue(
                article[sectionIndex]?.lectures[LectureIndex]?.title
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
                ...article[editing.sectionIndex],
                title: editSectionValue,
            };

            const data = {
                updatedSection,
                search,
            };

            const response = await fetch(
                `${process.env.API}/admin/Article/section/${updatedSection?._id}`,
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
                setArticle((prevSections) =>
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
                ...article[editing.sectionIndex]?.lectures[editing.LectureIndex],
                title: editLectureValue,
            };

            const sectionId = article[editing.sectionIndex]?._id;

            const data = {
                updatedSection,
                sectionId,
                search,
            };

            console.log("save lecture", data);

            const response = await fetch(
                `${process.env.API}/admin/Article/section/lecture/${article[editing.sectionIndex]?.lectures[editing.LectureIndex]?._id
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
                setArticle((prevSections) =>
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
            title: "New Lecture",
        };
        const sectionId = article[sectionIndex]?._id;
        setArticle((prevSections) =>
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
            `${process.env.API}/admin/Article/section/lecture`,
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

            setArticle((prevSections) =>
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

        const sectionId = article[sectionIndex]?._id;

        const data = {
            sectionId,
            search,
        };

        const response = await fetch(
            `${process.env.API}/admin/Article/section/lecture/${lectureId}`,
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
                setArticle((prevSections) =>
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
    const [openModal, setOpenModal] = useState(false);
    const [currentLecture, setCurrentLecture] = useState(null);
    const [content, setContent] = useState("");
    const [currentSectionIndex, setCurrentSectionIndex] = useState(null);
    const imageUploadCommand = {
        name: 'image-upload',
        keyCommand: 'image-upload',
        buttonProps: { 'aria-label': 'Upload image' },
        icon: <span role="img" aria-label="Upload image">📷</span>,
        execute: () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = async (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                    try {
                        const imageUrl = await imageUpload(file);
                        const imageMarkdown = `![${file.name}](${imageUrl})\n`;
                        setContent(prev => prev + imageMarkdown);
                    } catch (error) {
                        console.error('Image upload failed:', error);
                    }
                }
            };
            input.click();
        },
    };
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
        const sectionId = article[currentSectionIndex]?._id;
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
            `${process.env.API}/admin/Article/section/lecture/content/${lecturebody?._id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );
        if (response.ok) {
            setArticle((prevSections) =>
                prevSections.map((section) => ({
                    ...section,
                    lectures: section?.lectures.map((Lecture) =>
                        Lecture?._id === currentLecture?._id
                            ? {
                                ...Lecture,
                                content,
                            }
                            : Lecture
                    ),
                }))
            );
            fetchArticle(search); // Auto-reload after save
            toast.success("Article content updated!");
        } else {
            console.log("Failed to update");
        }
        handleCloseModal();
    };
    const handleOpenVideoModal = (Lecture, sectionIndex) => {
        if (!Lecture) {
            console.error("Lecture is undefined in handleOpenVideoModal", { Lecture, sectionIndex });
            setVideourl("");
            setCurrentLecture(null);
            setOpenVideoModal(false);
            return;
        }
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
        const sectionId = article[currentSectionIndex]?._id;
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
            `${process.env.API}/admin/Article/section/lecture/content/${lecturebody?._id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );
        if (response.ok) {
            setArticle((prevSections) =>
                prevSections.map((section) => ({
                    ...section,
                    lectures: section?.lectures.map((Lecture) =>
                        Lecture?._id === currentLecture?._id
                            ? {
                                ...Lecture,
                                videourl,
                            }
                            : Lecture
                    ),
                }))
            );
            fetchArticle(search); // Auto-reload after save
            toast.success("Article video updated!");
        } else {
            console.log("Failed to update video content");
        }
        handleCloseVideoModal();
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
    const moveSection = async (fromIndex, toIndex) => {
        console.log("From Index to To Index", { fromIndex, toIndex });

        const updatedSections = [...article];
        const [movedSection] = updatedSections.splice(fromIndex, 1);
        updatedSections.splice(toIndex, 0, movedSection);
        setArticle(updatedSections);

        try {
            await fetch(
                `${process.env.API}/admin/Article/section/updateSectionOrder`,
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

        const updatedSections = [...article];
        const [movedLecture] = updatedSections[fromSectionIndex].lectures.splice(
            fromLectureIndex,
            1
        );

        updatedSections[toSectionIndex].lectures.splice(
            toLectureIndex,
            0,
            movedLecture
        );

        setArticle(updatedSections);
        try {
            await fetch(
                `${process.env.API}/admin/Article/section/lecture/updateLectureOrder`,
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

    return (
        <>
            <Box
                sx={{
                    mt: 0,
                    padding: { xs: "24px 20px", sm: "32px 40px" },
                    background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                    textAlign: "center",
                    mb: 5,
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: "-100%",
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
                        animation: "shimmer 3s infinite",
                    },
                    "@keyframes shimmer": {
                        "0%": { left: "-100%" },
                        "100%": { left: "200%" }
                    }
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 900,
                        color: "#ffffff",
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                        textShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                        position: "relative",
                    }}
                >
                    <Box 
                        component="span" 
                        sx={{ 
                            fontSize: { xs: "2rem", sm: "2.5rem" },
                            filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))",
                        }}
                    >
                        ✍️
                    </Box>
                    {contenttitle}
                </Typography>
            </Box>
            <DndProvider backend={HTML5Backend}>
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: "1200px",
                        margin: "0 auto",
                        padding: { xs: "16px", sm: "24px", md: "32px" },
                        minHeight: "100vh",
                        background: "linear-gradient(145deg, #0a0f1e 0%, #0f172a 50%, #1e293b 100%)",
                    }}
                >
                    {article &&
                        article?.map((section, sectionIndex) => (

                            <DraggableSection
                                key={section?._id || section?.idindex || `section-${sectionIndex}`}
                                section={section}
                                index={sectionIndex}
                                moveSection={moveSection}
                            >
                                <Box
                                    key={`section-box-${section?._id || section?.idindex || sectionIndex}`}
                                    sx={{
                                        background: deletingSection === section?._id 
                                            ? "linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.2) 100%)"
                                            : "linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)",
                                        border: deletingSection === section?._id
                                            ? "2px solid rgba(239, 68, 68, 0.6)"
                                            : "2px solid rgba(59, 130, 246, 0.3)",
                                        padding: { xs: "20px", sm: "24px" },
                                        borderRadius: "24px",
                                        marginBottom: "24px",
                                        backdropFilter: "blur(20px) saturate(180%)",
                                        boxShadow: deletingSection === section?._id
                                            ? "0 12px 40px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
                                            : "0 12px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.1) inset, inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                        position: "relative",
                                        overflow: "hidden",
                                        "&::before": {
                                            content: '""',
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: "3px",
                                            background: "linear-gradient(90deg, transparent, #3b82f6, #8b5cf6, transparent)",
                                            opacity: 0.8,
                                        },
                                        "&:hover": {
                                            transform: "translateY(-4px)",
                                            boxShadow: "0 20px 60px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                                            border: "2px solid rgba(59, 130, 246, 0.5)",
                                        }
                                    }}
                                >
                                    {/* Combined title and icons in one horizontal row */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: "20px",
                                            padding: "16px 20px",
                                            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)",
                                            borderRadius: "16px",
                                            border: "1px solid rgba(59, 130, 246, 0.2)",
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{ 
                                                display: "flex", 
                                                alignItems: "center",
                                                color: "#e2e8f0",
                                                fontWeight: 800,
                                                fontSize: { xs: "1.1rem", sm: "1.3rem" },
                                                letterSpacing: "0.5px",
                                            }}
                                        >
                                            <DescriptionIcon
                                                sx={{
                                                    marginRight: "12px",
                                                    color: "#60a5fa",
                                                    fontSize: "1.8rem",
                                                    filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))",
                                                }}
                                            />
                                            Section {sectionIndex + 1}: {section?.title}
                                        </Typography>

                                        <Box sx={{ display: "flex", gap: 1 }}>
                                            <IconButton
                                                onClick={() => startEditing("section", sectionIndex)}
                                                sx={{
                                                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                                                    color: "#ffffff",
                                                    width: "44px",
                                                    height: "44px",
                                                    borderRadius: "12px",
                                                    transition: "all 0.3s ease",
                                                    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                                                    "&:hover": {
                                                        transform: "translateY(-3px) rotate(-5deg)",
                                                        boxShadow: "0 6px 16px rgba(59, 130, 246, 0.5)",
                                                        background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                                                    },
                                                }}
                                            >
                                                <EditIcon sx={{ fontSize: "1.3rem" }} />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleDeleteSection(section?._id)}
                                                sx={{
                                                    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                                                    color: "#ffffff",
                                                    width: "44px",
                                                    height: "44px",
                                                    borderRadius: "12px",
                                                    transition: "all 0.3s ease",
                                                    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                                                    "&:hover": {
                                                        transform: "translateY(-3px) scale(1.05)",
                                                        boxShadow: "0 6px 16px rgba(239, 68, 68, 0.5)",
                                                        background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                                                    },
                                                }}
                                            >
                                                <DeleteIcon sx={{ fontSize: "1.3rem" }} />
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
                                                    placeholder="Enter section title..."
                                                    sx={{
                                                        marginBottom: "16px",
                                                        "& .MuiOutlinedInput-input": {
                                                            color: "#e2e8f0",
                                                            fontSize: "1.1rem",
                                                            padding: "16px 18px",
                                                            fontWeight: 600,
                                                        },
                                                        "& .MuiOutlinedInput-root": {
                                                            borderRadius: "14px",
                                                            backgroundColor: "rgba(15, 23, 42, 0.8)",
                                                            backdropFilter: "blur(10px)",
                                                            transition: "all 0.3s ease",
                                                            "& fieldset": {
                                                                borderColor: "rgba(148, 163, 184, 0.3)",
                                                                borderWidth: "2px",
                                                            },
                                                            "&:hover": {
                                                                backgroundColor: "rgba(15, 23, 42, 0.95)",
                                                                transform: "translateY(-2px)",
                                                                "& fieldset": {
                                                                    borderColor: "rgba(59, 130, 246, 0.6)",
                                                                    boxShadow: "0 0 20px rgba(59, 130, 246, 0.2)",
                                                                }
                                                            },
                                                            "&.Mui-focused": {
                                                                backgroundColor: "rgba(15, 23, 42, 1)",
                                                                transform: "translateY(-2px)",
                                                                "& fieldset": {
                                                                    borderColor: "#3b82f6",
                                                                    borderWidth: "2.5px",
                                                                    boxShadow: "0 0 28px rgba(59, 130, 246, 0.4)",
                                                                }
                                                            },
                                                        },
                                                    }}
                                                />

                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "flex-end",
                                                        gap: 2,
                                                    }}
                                                >
                                                    <Button
                                                        variant="outlined"
                                                        onClick={handleCancelEdit}
                                                        sx={{
                                                            color: "#f87171",
                                                            borderColor: "#ef4444",
                                                            border: "2px solid #ef4444",
                                                            fontWeight: 700,
                                                            padding: "10px 24px",
                                                            borderRadius: "12px",
                                                            fontSize: "0.95rem",
                                                            textTransform: "none",
                                                            background: "rgba(15, 23, 42, 0.6)",
                                                            backdropFilter: "blur(10px)",
                                                            transition: "all 0.3s ease",
                                                            "&:hover": {
                                                                backgroundColor: "rgba(239, 68, 68, 0.15)",
                                                                borderColor: "#dc2626",
                                                                transform: "translateY(-2px)",
                                                                boxShadow: "0 6px 20px rgba(239, 68, 68, 0.4)",
                                                            },
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>

                                                    <Button
                                                        variant="contained"
                                                        onClick={handleSaveEdit}
                                                        sx={{
                                                            background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                                                            color: "#ffffff",
                                                            fontWeight: 700,
                                                            padding: "10px 28px",
                                                            borderRadius: "12px",
                                                            fontSize: "0.95rem",
                                                            textTransform: "none",
                                                            boxShadow: "0 6px 20px rgba(59, 130, 246, 0.4)",
                                                            transition: "all 0.3s ease",
                                                            "&:hover": {
                                                                background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                                                                transform: "translateY(-2px)",
                                                                boxShadow: "0 8px 28px rgba(59, 130, 246, 0.6)",
                                                            },
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
                                            <DraggableLecture
                                                key={Lecture?._id || Lecture?.idindex || `lecture-${sectionIndex}-${LectureIndex}`}
                                                sectionIndex={sectionIndex}
                                                lectureIndex={LectureIndex}
                                                lecture={Lecture}
                                                moveLecture={moveLecture}
                                            >

                                                <Box
                                                    key={`lecture-box-${Lecture?._id || Lecture?.idindex || `${sectionIndex}-${LectureIndex}`}`}
                                                    sx={{
                                                        background: deletingLecture?.sectionIndex === sectionIndex &&
                                                            deletingLecture?.lectureId === Lecture?._id
                                                            ? "linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(220, 38, 38, 0.15) 100%)"
                                                            : "linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(51, 65, 85, 0.4) 100%)",
                                                        border: deletingLecture?.sectionIndex === sectionIndex &&
                                                            deletingLecture?.lectureId === Lecture?._id
                                                            ? "2px solid rgba(239, 68, 68, 0.5)"
                                                            : "1px solid rgba(148, 163, 184, 0.2)",
                                                        padding: "16px",
                                                        borderRadius: "16px",
                                                        marginBottom: "12px",
                                                        backdropFilter: "blur(10px)",
                                                        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                                                        transition: "all 0.3s ease",
                                                        "&:hover": {
                                                            transform: "translateX(8px)",
                                                            border: "1px solid rgba(59, 130, 246, 0.4)",
                                                            boxShadow: "0 6px 24px rgba(59, 130, 246, 0.2)",
                                                        }
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="body1"
                                                            sx={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                color: "#cbd5e1",
                                                                fontWeight: 700,
                                                                fontSize: "1.05rem",
                                                            }}
                                                        >
                                                            <LibraryAddCheckIcon
                                                                sx={{
                                                                    marginRight: "10px",
                                                                    color: "#60a5fa",
                                                                    fontSize: "1.5rem",
                                                                }}
                                                            />
                                                            Lecture {LectureIndex + 1}: {Lecture?.title}
                                                        </Typography>

                                                        <Box sx={{ display: "flex", gap: 0.5 }}>
                                                            <IconButton
                                                                onClick={() =>
                                                                    handleOpenModal(Lecture, sectionIndex)
                                                                }
                                                                sx={{
                                                                    background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                                                                    color: "#ffffff",
                                                                    width: "38px",
                                                                    height: "38px",
                                                                    borderRadius: "10px",
                                                                    transition: "all 0.3s ease",
                                                                    "&:hover": {
                                                                        transform: "translateY(-2px)",
                                                                        boxShadow: "0 4px 12px rgba(139, 92, 246, 0.5)",
                                                                    },
                                                                }}
                                                            >
                                                                {Lecture?.content ? (
                                                                    <LibraryAddCheckIcon sx={{ fontSize: "1.1rem" }} />
                                                                ) : (
                                                                    <NotesIcon sx={{ fontSize: "1.1rem" }} />
                                                                )}
                                                            </IconButton>

                                                            <IconButton
                                                                onClick={() =>
                                                                    handleOpenVideoModal(Lecture, sectionIndex)
                                                                }
                                                                sx={{
                                                                    background: Lecture?.videourl 
                                                                        ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                                                                        : "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
                                                                    color: "#ffffff",
                                                                    width: "38px",
                                                                    height: "38px",
                                                                    borderRadius: "10px",
                                                                    transition: "all 0.3s ease",
                                                                    "&:hover": {
                                                                        transform: "translateY(-2px)",
                                                                        boxShadow: Lecture?.videourl
                                                                            ? "0 4px 12px rgba(16, 185, 129, 0.5)"
                                                                            : "0 4px 12px rgba(107, 114, 128, 0.5)",
                                                                    },
                                                                }}
                                                            >
                                                                {Lecture?.videourl ? (
                                                                    <OndemandVideoIcon sx={{ fontSize: "1.1rem" }} />
                                                                ) : (
                                                                    <PersonalVideoIcon sx={{ fontSize: "1.1rem" }} />
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
                                                                sx={{
                                                                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                                                                    color: "#ffffff",
                                                                    width: "38px",
                                                                    height: "38px",
                                                                    borderRadius: "10px",
                                                                    transition: "all 0.3s ease",
                                                                    "&:hover": {
                                                                        transform: "translateY(-2px)",
                                                                        boxShadow: "0 4px 12px rgba(59, 130, 246, 0.5)",
                                                                    },
                                                                }}
                                                            >
                                                                <EditIcon sx={{ fontSize: "1.1rem" }} />
                                                            </IconButton>

                                                            <IconButton
                                                                onClick={() =>
                                                                    handleDeleteLecture(sectionIndex, Lecture._id)
                                                                }
                                                                sx={{
                                                                    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                                                                    color: "#ffffff",
                                                                    width: "38px",
                                                                    height: "38px",
                                                                    borderRadius: "10px",
                                                                    transition: "all 0.3s ease",
                                                                    "&:hover": {
                                                                        transform: "translateY(-2px)",
                                                                        boxShadow: "0 4px 12px rgba(239, 68, 68, 0.5)",
                                                                    },
                                                                }}
                                                            >
                                                                <DeleteIcon sx={{ fontSize: "1.1rem" }} />
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
                                                                    placeholder="Enter lecture title..."
                                                                    value={editLectureValue || ""}
                                                                    onChange={(e) =>
                                                                        setEditLectureValue(e.target.value)
                                                                    }
                                                                    sx={{
                                                                        marginBottom: "16px",
                                                                        "& .MuiOutlinedInput-input": {
                                                                            color: "#e2e8f0",
                                                                            fontSize: "1rem",
                                                                            padding: "14px 16px",
                                                                            fontWeight: 600,
                                                                        },
                                                                        "& .MuiOutlinedInput-root": {
                                                                            borderRadius: "12px",
                                                                            backgroundColor: "rgba(15, 23, 42, 0.8)",
                                                                            backdropFilter: "blur(10px)",
                                                                            transition: "all 0.3s ease",
                                                                            "& fieldset": {
                                                                                borderColor: "rgba(148, 163, 184, 0.3)",
                                                                                borderWidth: "2px",
                                                                            },
                                                                            "&:hover": {
                                                                                backgroundColor: "rgba(15, 23, 42, 0.95)",
                                                                                "& fieldset": {
                                                                                    borderColor: "rgba(59, 130, 246, 0.5)",
                                                                                    boxShadow: "0 0 15px rgba(59, 130, 246, 0.15)",
                                                                                }
                                                                            },
                                                                            "&.Mui-focused": {
                                                                                backgroundColor: "rgba(15, 23, 42, 1)",
                                                                                "& fieldset": {
                                                                                    borderColor: "#3b82f6",
                                                                                    borderWidth: "2px",
                                                                                    boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
                                                                                }
                                                                            },
                                                                        },
                                                                    }}
                                                                />

                                                                <Box
                                                                    sx={{
                                                                        display: "flex",
                                                                        justifyContent: "flex-end",
                                                                        gap: 1.5,
                                                                    }}
                                                                >
                                                                    <Button
                                                                        variant="outlined"
                                                                        onClick={handleCancelEdit}
                                                                        sx={{
                                                                            color: "#f87171",
                                                                            borderColor: "#ef4444",
                                                                            border: "2px solid #ef4444",
                                                                            fontWeight: 700,
                                                                            padding: "8px 20px",
                                                                            borderRadius: "10px",
                                                                            fontSize: "0.9rem",
                                                                            textTransform: "none",
                                                                            background: "rgba(15, 23, 42, 0.6)",
                                                                            backdropFilter: "blur(10px)",
                                                                            transition: "all 0.3s ease",
                                                                            "&:hover": {
                                                                                backgroundColor: "rgba(239, 68, 68, 0.15)",
                                                                                borderColor: "#dc2626",
                                                                                transform: "translateY(-2px)",
                                                                                boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                                                                            },
                                                                        }}
                                                                    >
                                                                        Cancel
                                                                    </Button>
                                                                    <Button
                                                                        variant="contained"
                                                                        onClick={handleSaveEdit}
                                                                        sx={{
                                                                            background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                                                                            color: "#ffffff",
                                                                            fontWeight: 700,
                                                                            padding: "8px 24px",
                                                                            borderRadius: "10px",
                                                                            fontSize: "0.9rem",
                                                                            textTransform: "none",
                                                                            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                                                                            transition: "all 0.3s ease",
                                                                            "&:hover": {
                                                                                background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                                                                                transform: "translateY(-2px)",
                                                                                boxShadow: "0 6px 16px rgba(59, 130, 246, 0.5)",
                                                                            },
                                                                        }}
                                                                    >
                                                                        Save Lecture
                                                                    </Button>
                                                                </Box>
                                                            </Box>
                                                        )}
                                                </Box>
                                            </DraggableLecture>

                                        ))}

                                        <Button
                                            variant="contained"
                                            startIcon={<AddIcon sx={{ fontSize: "1.3rem" }} />}
                                            onClick={() => handleAddLecture(sectionIndex)}
                                            sx={{
                                                marginTop: "16px",
                                                background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)",
                                                color: "#ffffff",
                                                fontWeight: 700,
                                                padding: "12px 28px",
                                                borderRadius: "14px",
                                                fontSize: "1rem",
                                                textTransform: "none",
                                                letterSpacing: "0.5px",
                                                boxShadow: "0 6px 20px rgba(59, 130, 246, 0.4), 0 3px 0 rgba(59, 130, 246, 0.3)",
                                                transition: "all 0.3s ease",
                                                "&:hover": {
                                                    background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)",
                                                    transform: "translateY(-4px)",
                                                    boxShadow: "0 10px 28px rgba(59, 130, 246, 0.6), 0 5px 0 rgba(59, 130, 246, 0.4)",
                                                },
                                                "&:active": {
                                                    transform: "translateY(-2px)",
                                                    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4), 0 2px 0 rgba(59, 130, 246, 0.3)",
                                                },
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
                        startIcon={<AddIcon sx={{ fontSize: "1.5rem" }} />}
                        onClick={handleAddSection}
                        fullWidth
                        sx={{
                            marginTop: "32px",
                            marginBottom: "32px",
                            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                            color: "#ffffff",
                            fontWeight: 800,
                            padding: "16px 40px",
                            borderRadius: "16px",
                            fontSize: "1.1rem",
                            textTransform: "none",
                            letterSpacing: "1px",
                            boxShadow: "0 8px 28px rgba(16, 185, 129, 0.5), 0 4px 0 rgba(16, 185, 129, 0.3)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                                transform: "translateY(-6px)",
                                boxShadow: "0 12px 36px rgba(16, 185, 129, 0.7), 0 6px 0 rgba(16, 185, 129, 0.4)",
                            },
                            "&:active": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 16px rgba(16, 185, 129, 0.5), 0 2px 0 rgba(16, 185, 129, 0.3)",
                            },
                        }}
                    >
                        Add Section
                    </Button>
                    <Modal 
                        open={openModal} 
                        onClose={handleCloseModal}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Box
                            sx={{
                                width: { xs: "95%", sm: "90%", md: "85%", lg: "80%" },
                                maxWidth: "1400px",
                                maxHeight: "92vh",
                                overflow: "auto",
                                background: "linear-gradient(145deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%)",
                                backdropFilter: "blur(40px) saturate(180%)",
                                borderRadius: "24px",
                                border: "2px solid rgba(59, 130, 246, 0.4)",
                                boxShadow: "0 32px 96px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(59, 130, 246, 0.3) inset, inset 0 2px 0 rgba(255, 255, 255, 0.1)",
                                p: { xs: 3, sm: 4, md: 5 },
                                position: "relative",
                                "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: "4px",
                                    background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #3b82f6 100%)",
                                    borderRadius: "24px 24px 0 0",
                                },
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    mb: 4,
                                    color: "#ffffff",
                                    fontWeight: 800,
                                    fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    padding: "20px 24px",
                                    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.15) 100%)",
                                    borderRadius: "16px",
                                    border: "2px solid rgba(59, 130, 246, 0.3)",
                                    boxShadow: "0 4px 20px rgba(59, 130, 246, 0.2)",
                                }}
                            >
                                <Box 
                                    component="span" 
                                    sx={{ 
                                        fontSize: { xs: "1.8rem", sm: "2.2rem" },
                                        filter: "drop-shadow(0 0 10px rgba(59, 130, 246, 0.6))",
                                    }}
                                >
                                    ✏️
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Box sx={{ fontSize: { xs: "1.3rem", sm: "1.6rem" }, fontWeight: 800 }}>
                                        Edit Lecture Content
                                    </Box>
                                    <Box sx={{ 
                                        fontSize: { xs: "0.9rem", sm: "1rem" }, 
                                        fontWeight: 600, 
                                        color: "#93c5fd",
                                        mt: 0.5,
                                    }}>
                                        {currentLecture?.title}
                                    </Box>
                                </Box>
                            </Typography>

                            <Box
                                sx={{
                                    background: "rgba(15, 23, 42, 0.6)",
                                    borderRadius: "20px",
                                    padding: "24px",
                                    border: "2px solid rgba(59, 130, 246, 0.2)",
                                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                                    "& .w-md-editor": {
                                        backgroundColor: "transparent !important",
                                        color: "#e2e8f0 !important",
                                        borderRadius: "16px",
                                        overflow: "hidden",
                                        border: "2px solid rgba(59, 130, 246, 0.3)",
                                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                                    },
                                    "& .w-md-editor-toolbar": {
                                        background: "linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.9) 100%)",
                                        borderBottom: "2px solid rgba(59, 130, 246, 0.3)",
                                        padding: "12px",
                                    },
                                    "& .w-md-editor-toolbar button": {
                                        color: "#cbd5e1 !important",
                                        transition: "all 0.3s ease",
                                        borderRadius: "8px",
                                        "&:hover": {
                                            backgroundColor: "rgba(59, 130, 246, 0.2) !important",
                                            transform: "scale(1.1)",
                                        },
                                    },
                                    "& .w-md-editor-text-pre, & .w-md-editor-text-input": {
                                        color: "#e2e8f0 !important",
                                        fontSize: "1rem !important",
                                        lineHeight: "1.7 !important",
                                    },
                                    "& .w-md-editor-text": {
                                        background: "rgba(15, 23, 42, 0.8) !important",
                                    },
                                }}
                            >
                                <MDEditor
                                    value={content}
                                    height={500}
                                    onChange={(val) => setContent(val || "")}
                                    preview="edit"
                                    data-color-mode="dark"
                                    commands={[
                                        ...commands.getCommands(),
                                        commands.divider,
                                        imageUploadCommand
                                    ]}
                                    onDrop={async (event) => {
                                        event.preventDefault();
                                        const files = Array.from(event.dataTransfer.files);
                                        const imageFiles = files.filter(file => file.type.startsWith('image/'));

                                        for (const file of imageFiles) {
                                            try {
                                                const imageUrl = await imageUpload(file);
                                                const imageMarkdown = `![${file.name}](${imageUrl})\n`;
                                                setContent(prev => prev + imageMarkdown);
                                                toast.success('Image uploaded successfully!');
                                            } catch (error) {
                                                console.error('Image upload failed:', error);
                                                toast.error('Image upload failed');
                                            }
                                        }
                                    }}
                                    onPaste={async (event) => {
                                        const items = Array.from(event.clipboardData.items);
                                        const imageItems = items.filter(item => item.type.startsWith('image/'));

                                        for (const item of imageItems) {
                                            const file = item.getAsFile();
                                            if (file) {
                                                try {
                                                    event.preventDefault();
                                                    const imageUrl = await imageUpload(file);
                                                    const imageMarkdown = `![Pasted Image](${imageUrl})\n`;
                                                    setContent(prev => prev + imageMarkdown);
                                                    toast.success('Image pasted successfully!');
                                                } catch (error) {
                                                    console.error('Image upload failed:', error);
                                                    toast.error('Image paste failed');
                                                }
                                            }
                                        }
                                    }}
                                />
                            </Box>

                            <Box 
                                sx={{ 
                                    display: "flex", 
                                    justifyContent: "flex-end", 
                                    gap: 2,
                                    mt: 4,
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    onClick={handleCloseModal}
                                    sx={{
                                        color: "#f87171",
                                        borderColor: "#ef4444",
                                        border: "2px solid #ef4444",
                                        fontWeight: 700,
                                        padding: "12px 32px",
                                        borderRadius: "14px",
                                        fontSize: "1rem",
                                        textTransform: "none",
                                        background: "rgba(15, 23, 42, 0.6)",
                                        backdropFilter: "blur(10px)",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            backgroundColor: "rgba(239, 68, 68, 0.15)",
                                            borderColor: "#dc2626",
                                            transform: "translateY(-2px)",
                                            boxShadow: "0 6px 20px rgba(239, 68, 68, 0.4)",
                                        },
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSaveContent}
                                    sx={{
                                        background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                                        color: "#ffffff",
                                        fontWeight: 700,
                                        padding: "12px 40px",
                                        borderRadius: "14px",
                                        fontSize: "1rem",
                                        textTransform: "none",
                                        boxShadow: "0 6px 20px rgba(59, 130, 246, 0.5)",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                                            transform: "translateY(-3px)",
                                            boxShadow: "0 10px 28px rgba(59, 130, 246, 0.7)",
                                        },
                                    }}
                                >
                                    Save Content
                                </Button>
                            </Box>
                        </Box>
                    </Modal>

                    {/* Modal for editing lecture video content */}
                    <Modal 
                        open={openVideoModal} 
                        onClose={handleCloseVideoModal}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Box
                            sx={{
                                width: { xs: "95%", sm: "90%", md: "85%", lg: "75%" },
                                maxWidth: "1200px",
                                maxHeight: "95vh",
                                overflow: "auto",
                                background: "linear-gradient(145deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%)",
                                backdropFilter: "blur(40px) saturate(180%)",
                                borderRadius: "24px",
                                border: "2px solid rgba(16, 185, 129, 0.4)",
                                boxShadow: "0 32px 96px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(16, 185, 129, 0.3) inset, inset 0 2px 0 rgba(255, 255, 255, 0.1)",
                                p: { xs: 3, sm: 4, md: 5 },
                                position: "relative",
                                "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: "4px",
                                    background: "linear-gradient(90deg, #10b981 0%, #059669 50%, #10b981 100%)",
                                    borderRadius: "24px 24px 0 0",
                                },
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    mb: 4,
                                    color: "#ffffff",
                                    fontWeight: 800,
                                    fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    padding: "20px 24px",
                                    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.15) 100%)",
                                    borderRadius: "16px",
                                    border: "2px solid rgba(16, 185, 129, 0.3)",
                                    boxShadow: "0 4px 20px rgba(16, 185, 129, 0.2)",
                                }}
                            >
                                <Box 
                                    component="span" 
                                    sx={{ 
                                        fontSize: { xs: "1.8rem", sm: "2.2rem" },
                                        filter: "drop-shadow(0 0 10px rgba(16, 185, 129, 0.6))",
                                    }}
                                >
                                    🎬
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Box sx={{ fontSize: { xs: "1.3rem", sm: "1.6rem" }, fontWeight: 800 }}>
                                        Edit Video Content
                                    </Box>
                                    <Box sx={{ 
                                        fontSize: { xs: "0.9rem", sm: "1rem" }, 
                                        fontWeight: 600, 
                                        color: "#6ee7b7",
                                        mt: 0.5,
                                    }}>
                                        {currentLecture?.title}
                                    </Box>
                                </Box>
                            </Typography>

                            <Box
                                sx={{
                                    background: "rgba(15, 23, 42, 0.6)",
                                    borderRadius: "20px",
                                    padding: "24px",
                                    border: "2px solid rgba(16, 185, 129, 0.2)",
                                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                                    mb: 3,
                                }}
                            >
                                <TextField
                                    label="Video URL"
                                    placeholder="Enter YouTube, Vimeo, or direct video URL..."
                                    variant="outlined"
                                    fullWidth
                                    value={videourl}
                                    onChange={(e) => setVideourl(e.target.value)}
                                    InputLabelProps={{
                                        sx: { 
                                            color: "#6ee7b7",
                                            fontWeight: 600,
                                            fontSize: "1rem",
                                        },
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-input": {
                                            color: "#e2e8f0",
                                            fontSize: "1rem",
                                            padding: "16px 18px",
                                            fontWeight: 500,
                                        },
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "14px",
                                            backgroundColor: "rgba(15, 23, 42, 0.8)",
                                            backdropFilter: "blur(10px)",
                                            transition: "all 0.3s ease",
                                            "& fieldset": {
                                                borderColor: "rgba(16, 185, 129, 0.4)",
                                                borderWidth: "2px",
                                            },
                                            "&:hover": {
                                                backgroundColor: "rgba(15, 23, 42, 0.95)",
                                                transform: "translateY(-2px)",
                                                "& fieldset": {
                                                    borderColor: "rgba(16, 185, 129, 0.6)",
                                                    boxShadow: "0 0 20px rgba(16, 185, 129, 0.2)",
                                                }
                                            },
                                            "&.Mui-focused": {
                                                backgroundColor: "rgba(15, 23, 42, 1)",
                                                transform: "translateY(-2px)",
                                                "& fieldset": {
                                                    borderColor: "#10b981",
                                                    borderWidth: "2.5px",
                                                    boxShadow: "0 0 28px rgba(16, 185, 129, 0.4)",
                                                }
                                            },
                                        },
                                    }}
                                />
                            </Box>

                            {currentLecture && currentLecture.videourl ? (
                                <Box
                                    sx={{
                                        width: "100%",
                                        aspectRatio: "16/9",
                                        borderRadius: "20px",
                                        overflow: "hidden",
                                        background: "rgba(0, 0, 0, 0.4)",
                                        border: "2px solid rgba(16, 185, 129, 0.3)",
                                        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                                        mb: 3,
                                    }}
                                >
                                    <ReactPlayer
                                        src={currentLecture.videourl}
                                        width="100%"
                                        height="100%"
                                        controls
                                        light={true}
                                        playing={false}
                                        config={{
                                            youtube: {
                                                iv_load_policy: 1
                                            }
                                        }}
                                    />
                                </Box>
                            ) : (
                                <Box 
                                    sx={{ 
                                        padding: "60px 24px", 
                                        textAlign: "center",
                                        background: "rgba(15, 23, 42, 0.6)",
                                        borderRadius: "20px",
                                        border: "2px dashed rgba(16, 185, 129, 0.3)",
                                        mb: 3,
                                    }}
                                >
                                    <Box 
                                        component="span" 
                                        sx={{ 
                                            fontSize: "4rem",
                                            opacity: 0.5,
                                            display: "block",
                                            mb: 2,
                                        }}
                                    >
                                        🎥
                                    </Box>
                                    <Typography sx={{ color: "#94a3b8", fontSize: "1.1rem", fontWeight: 600 }}>
                                        No video URL provided yet
                                    </Typography>
                                    <Typography sx={{ color: "#64748b", fontSize: "0.95rem", mt: 1 }}>
                                        Add a video URL above to preview
                                    </Typography>
                                </Box>
                            )}

                            <Box 
                                sx={{ 
                                    display: "flex", 
                                    justifyContent: "flex-end", 
                                    gap: 2,
                                    mt: 4,
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    onClick={handleCloseVideoModal}
                                    sx={{
                                        color: "#f87171",
                                        borderColor: "#ef4444",
                                        border: "2px solid #ef4444",
                                        fontWeight: 700,
                                        padding: "12px 32px",
                                        borderRadius: "14px",
                                        fontSize: "1rem",
                                        textTransform: "none",
                                        background: "rgba(15, 23, 42, 0.6)",
                                        backdropFilter: "blur(10px)",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            backgroundColor: "rgba(239, 68, 68, 0.15)",
                                            borderColor: "#dc2626",
                                            transform: "translateY(-2px)",
                                            boxShadow: "0 6px 20px rgba(239, 68, 68, 0.4)",
                                        },
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSaveVideoContent}
                                    sx={{
                                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                        color: "#ffffff",
                                        fontWeight: 700,
                                        padding: "12px 40px",
                                        borderRadius: "14px",
                                        fontSize: "1rem",
                                        textTransform: "none",
                                        boxShadow: "0 6px 20px rgba(16, 185, 129, 0.5)",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                                            transform: "translateY(-3px)",
                                            boxShadow: "0 10px 28px rgba(16, 185, 129, 0.7)",
                                        },
                                    }}
                                >
                                    Save Video
                                </Button>
                            </Box>
                        </Box>
                    </Modal>


                </Box>
            </DndProvider>
            <Sidebar />

        </>
    )
}
export default ArticleEditor;