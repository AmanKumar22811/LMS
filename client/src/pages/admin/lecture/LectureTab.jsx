import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
} from "@/features/api/courseApi";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const MEDIA_API = "http://localhost:8000/api/v1/media";

const LectureTab = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnDisable, setBtnDisable] = useState(true);
  const { courseId, lectureId } = useParams();

  const { data: lectureData } = useGetLectureByIdQuery(lectureId);
  const lecture = lectureData?.lecture;

  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture?.lectureTitle);
      setIsFree(lecture?.isPreviewFree);
      setUploadVideoInfo(lecture?.videoInfo);
    }
  }, [lecture]);

  const [editLecture, { data, isLoading, error, isSuccess }] =
    useEditLectureMutation();

  const [
    removeLecture,
    {
      data: removeData,
      isLoading: removeIsloading,
      isSuccess: removeIsSuccess,
      error: removeLectureError,
    },
  ] = useRemoveLectureMutation();

  const fileChangeHandler = async (e) => {
    const file = e?.target?.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setMediaProgress(true);

      try {
        const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });

        if (res?.data?.success) {
          setUploadVideoInfo({
            videoUrl: res?.data?.data?.url,
            publicId: res?.data?.data?.public_id,
          });
          setBtnDisable(false);
          toast.success(res?.data?.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Video upload failed.");
      } finally {
        setMediaProgress(false);
      }
    }
  };

  const editLectureHandler = async () => {
    await editLecture({
      lectureTitle,
      videoInfo: uploadVideoInfo,
      isPreviewFree: isFree,
      courseId,
      lectureId,
    });
  };

  const removeHandler = async () => {
    await removeLecture(lectureId);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message);
    }
    if (error) {
      toast.error(error.data.message);
    }
  }, [isSuccess, error]);

  useEffect(() => {
    if (removeIsSuccess) {
      toast.success(removeData?.message);
    }
    if (removeLectureError) {
      toast.removeLectureError(removeLectureError?.data?.message);
    }
  }, [removeIsSuccess, removeLectureError]);

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>
            Make changes and click update lecture when done.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            onClick={removeHandler}
            disabled={removeIsloading}
          >
            {removeIsloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait...
              </>
            ) : (
              "Remove Lecture"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            placeholder="Enter the Title"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
          />
        </div>

        <div className="my-5">
          <Label>
            Video <span className="text-red-500">*</span>
          </Label>
          <Input
            type="file"
            accept="video/*"
            onChange={fileChangeHandler}
            className="w-fit cursor-pointer"
          />
        </div>

        {mediaProgress && (
          <div className="my-4">
            <Progress value={uploadProgress} />
            <p>{uploadProgress}% uploaded</p>
          </div>
        )}

        <div className="flex items-center space-x-2 my-5">
          <Switch
            id="airplane-mode"
            checked={isFree}
            onCheckedChange={setIsFree}
          />
          <Label htmlFor="airplane-mode">Is this video FREE</Label>
        </div>

        <div className="mt-4">
          <Button onClick={editLectureHandler} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 /> Please Wait...
              </>
            ) : (
              "Update Lecture"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LectureTab;
