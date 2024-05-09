"use client";

import {motion} from "framer-motion";
import React, {useRef, useState} from "react";
import {AuroraBackground} from "@/components/aurora-background";
import {Button} from "@/components/moving-border";

export default function Home() {

    const fileInputRef = useRef(null);
    const [buttonText, setButtonText] = useState('转换 .ncm 文件！');
    const [isUploading, setIsUploading] = useState(false);


    const handleButtonClick = () => {
        // @ts-ignore
        fileInputRef.current.click();
    };

    const handleFileChange = async (event: any) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            // formData.append("file", file, encodeURIComponent(file.name));
            formData.append("file", file, Date.now().toString());
            setButtonText('上传中...');
            setIsUploading(true);


            try {
                const response = await fetch("https://ncm-backend-production.up.railway.app/api/ncm", {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const contentDisposition = response.headers.get('Content-Disposition');
                let filename = "default_filename";
                if (contentDisposition) {
                    const filenameRegex = /filename\*?=['"]?(?:UTF-8'')?([^"';]*)['"]?;?/i;
                    const matches = filenameRegex.exec(contentDisposition);
                    if (matches != null && matches[1]) {
                        console.log(matches[1])
                        filename = decodeURIComponent(matches[1]);
                    }
                }


                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Error downloading the file: ', error);
            } finally {
                setButtonText('转换 .ncm 文件！');
                setIsUploading(false);
            }
        }
    };

    return (
        <>
            <AuroraBackground>
                <motion.div
                    initial={{opacity: 0.0, y: 40}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: "easeInOut",
                    }}
                    className="relative flex flex-col gap-4 items-center justify-center px-4"
                >
                    <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
                        网易云白嫖计划
                    </div>
                    <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
                        开了 VIP 还拿不到音乐文件？
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{display: 'none'}}
                        accept=".ncm"
                    />
                    <Button
                        onClick={handleButtonClick}
                        borderRadius="1.75rem"
                        className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                        disabled={isUploading}
                    >
                        {buttonText}
                    </Button>
                </motion.div>
            </AuroraBackground>
        </>
    );
}
