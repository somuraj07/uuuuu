"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import CommonModal from "@/components/ui/models/CommonModel";
import CommonButton from "@/components/ui/common/CommonButton";
import DynamicForm from "@/components/ui/models/DynamicForm";
import { FiPlus, FiArrowRight, FiTrendingUp } from "react-icons/fi";
import { toast } from "@/services/toast/toast.service";
import { addNewsfeedFields } from "@/constants/schooladmin/createPostForm";
import { MAIN_COLOR } from "@/constants/colors";
import { HiSparkles } from "react-icons/hi";

interface NewsFeed {
    id: string;
    title: string;
    description: string;
    tagline?: string;
    mediaUrl?: string | null;
    createdAt: string;
}

/* ---------------- Animations ---------------- */

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.15 },
    },
};

const leftToRightCard: Variants = {
    hidden: { x: -80, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

/* ---------------- Helpers ---------------- */

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
    });
}

export default function NewsfeedPage({mode}:{mode?:string}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newsFeeds, setNewsFeeds] = useState<NewsFeed[]>([]);

    const featuredPost = newsFeeds[0];
    const otherPosts = newsFeeds.slice(1);

    /* ---------------- Fetch ---------------- */

    const fetchNewsFeeds = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/newsfeed/list");
            const data = await res.json();
            setNewsFeeds(data.newsFeeds || []);
        } catch {
            toast.error("Failed to load newsfeed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNewsFeeds();
    }, []);

    /* ---------------- Create ---------------- */

    const handleCreatePost = async (values: Record<string, any>) => {
        try {
            let mediaUrl: string | null = null;

            if (values.media) {
                if (values.media.size > 500_000) {
                    toast.error("Image must be less than 500KB");
                    return;
                }
                mediaUrl = await fileToBase64(values.media);
            }

            const res = await fetch("/api/newsfeed/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: values.title,
                    description: values.description,
                    tagline: values.tagline,
                    mediaUrl,
                    mediaType: mediaUrl ? "image" : null,
                }),
            });

            if (!res.ok) throw new Error();

            toast.success("Post created successfully");
            setOpen(false);
            fetchNewsFeeds();
        } catch {
            toast.error("Something went wrong");
        }
    };

    /* ---------------- UI ---------------- */

    return (
        <div className="p-4 sm:p-6 space-y-10">
            {/* ---------- Hero ---------- */}
            {mode!=="home" && (<div className="bg-gradient-to-r from-purple-50 via-purple-100 to-white border border-purple-100 rounded-2xl p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                       <HiSparkles size={22} style={{ color: MAIN_COLOR }} /> Welcome to Our School Newsfeed
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl">
                        Stay updated with the latest happenings, achievements, and
                        announcements from our vibrant school community
                    </p>
                </div>

                <CommonButton
                    label="Add News"
                    icon={<FiPlus />}
                    onClick={() => setOpen(true)}
                />
            </div>)}

            {/* ---------- Modal ---------- */}
            <CommonModal
                open={open}
                onClose={() => setOpen(false)}
                title="Create Post"
                width="max-w-xl"
            >
                <DynamicForm
                    fields={addNewsfeedFields}
                    submitLabel="Publish"
                    onSubmit={handleCreatePost}
                />
            </CommonModal>

            {loading ? (
                <div className="flex justify-center py-24 text-sm text-gray-500">
                    Loading newsfeed...
                </div>
            ) : (
                <>
                    {/* ---------- Latest Update ---------- */}
                    {featuredPost && (
                        <div className="space-y-4">
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                                <FiTrendingUp className="text-green-600" />
                                Latest Update
                            </h2>

                            <motion.div
                                variants={leftToRightCard}
                                initial="hidden"
                                animate="visible"
                                whileHover={{
                                    scale: 1.02,
                                    y: -6,
                                    boxShadow: "0 25px 50px rgba(0,0,0,0.12)",
                                }}
                                className="border border-gray-200 rounded-3xl overflow-hidden"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-2">
                                    {/* Image */}
                                    {featuredPost.mediaUrl && (
                                        <div className="relative">
                                            <img
                                                src={featuredPost.mediaUrl}
                                                className="h-[380px] w-full object-cover"
                                                alt={featuredPost.title}
                                            />

                                            <span
                                                className="absolute flex top-4 left-4 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow"
                                                style={{ backgroundColor: MAIN_COLOR }}
                                            >
                                                <HiSparkles size={16} /> <span>NEW</span>
                                            </span>

                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="p-8 space-y-4">
                                        <p className="text-xs" style={{ color: MAIN_COLOR }}>
                                            {new Date(featuredPost.createdAt).toLocaleDateString()}
                                        </p>

                                        <h2 className="text-2xl font-bold text-gray-900">
                                            {featuredPost.title}
                                        </h2>

                                        <p className="font-semibold" style={{ color: MAIN_COLOR }}>
                                            {featuredPost.tagline}
                                        </p>

                                        <p className="text-gray-700 leading-relaxed">
                                            {featuredPost.description}
                                        </p>

                                        {/* <button className="flex items-center gap-2 text-green-600 font-medium">
                                            Read Full Story <FiArrowRight />
                                        </button> */}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* ---------- More Updates ---------- */}
                    {otherPosts.length > 0 && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900">
                                More Updates
                            </h2>

                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                            >
                                {otherPosts.map((post) => (
                                    <motion.div
                                        key={post.id}
                                        variants={leftToRightCard}
                                        whileHover={{
                                            scale: 1.03,
                                            y: -6,
                                            boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                                        }}
                                        className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
                                    >
                                        {post.mediaUrl && (
                                            <img
                                                src={post.mediaUrl}
                                                className="h-56 w-full object-cover"
                                                alt={post.title}
                                            />
                                        )}

                                        <div className="p-6 space-y-3">
                                            <p className="text-xs text-gray-500">
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </p>

                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {post.title}
                                            </h3>

                                            <p className="text-sm text-gray-600 line-clamp-3">
                                                {post.description}
                                            </p>

                                            {/* <button className="flex items-center gap-1 text-green-600 font-medium text-sm">
                                                Read More <FiArrowRight />
                                            </button> */}
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
