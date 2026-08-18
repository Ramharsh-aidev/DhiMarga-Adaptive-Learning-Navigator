package com.ttd.lms.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.ttd.lms.entity.Chapter;
import com.ttd.lms.entity.Course;
import com.ttd.lms.exception.BadRequestException;
import com.ttd.lms.exception.ForbiddenException;
import com.ttd.lms.exception.ResourceNotFoundException;
import com.ttd.lms.model.ChapterResponse;
import com.ttd.lms.model.CreateChapterRequest;
import com.ttd.lms.model.UpdateChapterRequest;
import com.ttd.lms.repository.ChapterRepository;
import com.ttd.lms.repository.CourseRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChapterService {

    private final ChapterRepository chapterRepository;
    private final CourseRepository courseRepository;
    private final CourseService courseService;
    private final Cloudinary cloudinary;

    @Transactional
    public ChapterResponse addChapter(@NonNull UUID courseId, @NonNull UUID mentorId, 
                                      @NonNull CreateChapterRequest request) {
        log.info("Adding new chapter to course: {} by mentor: {}", courseId, mentorId);

        // Validate course exists and mentor owns it
        @SuppressWarnings("unused")
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        if (!courseService.isCourseOwner(courseId, mentorId)) {
            throw new ForbiddenException("You can only add chapters to your own courses");
        }

        // Validate chapter title
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new BadRequestException("Chapter title is required");
        }

        // Determine sequence order (auto-increment)
        Integer maxSequence = chapterRepository.findMaxSequenceOrderByCourseId(courseId).orElse(null);
        int newSequence = (maxSequence != null) ? maxSequence + 1 : 1;

        // Create chapter
        Chapter chapter = Chapter.builder()
                .courseId(courseId)
                .title(request.getTitle().trim())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .videoUrl(request.getVideoUrl())
                .cloudinaryPublicId(request.getCloudinaryPublicId())
                .videoDuration(request.getVideoDuration())
                .sequenceOrder(newSequence)
                .build();

        @SuppressWarnings("null")
        @NonNull Chapter savedChapter = chapterRepository.save(chapter);
        log.info("Chapter created successfully: {} for course: {}", savedChapter.getId(), courseId);

        return buildChapterResponse(savedChapter);
    }

    /* Upload video to Cloudinary and create chapter */
    @Transactional
    public ChapterResponse addChapterWithVideo(@NonNull UUID courseId, @NonNull UUID mentorId,
                                               @NonNull String title, String description, 
                                               String imageUrl, @NonNull MultipartFile videoFile) {
        log.info("Uploading video and creating chapter for course: {}", courseId);

        // Validate course ownership
        if (!courseService.isCourseOwner(courseId, mentorId)) {
            throw new ForbiddenException("You can only add chapters to your own courses");
        }

        // Validate video file
        if (videoFile.isEmpty()) {
            throw new BadRequestException("Video file is required");
        }

        // Upload video to Cloudinary
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                    videoFile.getBytes(),
                    ObjectUtils.asMap(
                            "resource_type", "video",
                            "folder", "lms/course-videos",
                            "chunk_size", 6000000 // 6MB chunks for large videos
                    )
            );

            String videoUrl = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");
            Number duration = (Number) uploadResult.get("duration");
            
            log.info("Video uploaded successfully to Cloudinary: {}", publicId);

            // Create chapter with video details
            CreateChapterRequest request = new CreateChapterRequest();
            request.setTitle(title);
            request.setDescription(description);
            request.setImageUrl(imageUrl);
            request.setVideoUrl(videoUrl);
            request.setCloudinaryPublicId(publicId);
            request.setVideoDuration(duration != null ? duration.intValue() : null);

            return addChapter(courseId, mentorId, request);

        } catch (IOException e) {
            log.error("Failed to upload video to Cloudinary", e);
            throw new BadRequestException("Failed to upload video: " + e.getMessage());
        }
    }

    @Transactional
    public ChapterResponse updateChapter(@NonNull UUID chapterId, @NonNull UUID mentorId, 
                                        @NonNull UpdateChapterRequest request) {
        log.info("Updating chapter: {} by mentor: {}", chapterId, mentorId);

        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter not found"));

        // Check course ownership
        if (!courseService.isCourseOwner(chapter.getCourseId(), mentorId)) {
            throw new ForbiddenException("You can only update chapters in your own courses");
        }

        // Update fields
        if (request.getTitle() != null && !request.getTitle().trim().isEmpty()) {
            chapter.setTitle(request.getTitle().trim());
        }

        if (request.getDescription() != null) {
            chapter.setDescription(request.getDescription());
        }

        if (request.getImageUrl() != null) {
            chapter.setImageUrl(request.getImageUrl());
        }

        if (request.getVideoUrl() != null) {
            chapter.setVideoUrl(request.getVideoUrl());
        }

        if (request.getCloudinaryPublicId() != null) {
            chapter.setCloudinaryPublicId(request.getCloudinaryPublicId());
        }

        if (request.getVideoDuration() != null) {
            chapter.setVideoDuration(request.getVideoDuration());
        }

        if (request.getSequenceOrder() != null) {
            chapter.setSequenceOrder(request.getSequenceOrder());
        }

        @NonNull Chapter updatedChapter = chapterRepository.save(chapter);
        log.info("Chapter updated successfully: {}", chapterId);

        return buildChapterResponse(updatedChapter);
    }

    @Transactional
    public void deleteChapter(@NonNull UUID chapterId, @NonNull UUID mentorId) {
        log.info("Deleting chapter: {} by mentor: {}", chapterId, mentorId);

        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter not found"));

        // Check course ownership
        if (!courseService.isCourseOwner(chapter.getCourseId(), mentorId)) {
            throw new ForbiddenException("You can only delete chapters from your own courses");
        }

        // Delete video from Cloudinary if exists
        if (chapter.getCloudinaryPublicId() != null && !chapter.getCloudinaryPublicId().isEmpty()) {
            try {
                cloudinary.uploader().destroy(
                        chapter.getCloudinaryPublicId(),
                        ObjectUtils.asMap("resource_type", "video")
                );
                log.info("Video deleted from Cloudinary: {}", chapter.getCloudinaryPublicId());
            } catch (IOException e) {
                log.error("Failed to delete video from Cloudinary: {}", chapter.getCloudinaryPublicId(), e);
                // Continue with chapter deletion even if Cloudinary deletion fails
            }
        }

        chapterRepository.delete(chapter);
        log.info("Chapter deleted successfully: {}", chapterId);
    }

    @Transactional(readOnly = true)
    public List<ChapterResponse> getChaptersByCourse(@NonNull UUID courseId) {
        log.info("Fetching chapters for course: {}", courseId);

        // Validate course exists
        courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        List<Chapter> chapters = chapterRepository.findByCourseIdOrderBySequenceOrderAsc(courseId);

        return chapters.stream()
                .map(this::buildChapterResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ChapterResponse getChapterById(@NonNull UUID chapterId) {
        log.info("Fetching chapter: {}", chapterId);

        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter not found"));

        return buildChapterResponse(chapter);
    }

    /* Get next chapter in sequence */
    @Transactional(readOnly = true)
    public ChapterResponse getNextChapter(@NonNull UUID courseId, int currentSequenceOrder) {
        log.info("Fetching next chapter for course: {} after sequence: {}", courseId, currentSequenceOrder);

        Chapter nextChapter = chapterRepository.findNextChapter(courseId, currentSequenceOrder)
                .orElseThrow(() -> new ResourceNotFoundException("No next chapter found"));

        return buildChapterResponse(nextChapter);
    }

    /* Get previous chapter in sequence */
    @Transactional(readOnly = true)
    public ChapterResponse getPreviousChapter(@NonNull UUID courseId, int currentSequenceOrder) {
        log.info("Fetching previous chapter for course: {} before sequence: {}", courseId, currentSequenceOrder);

        Chapter previousChapter = chapterRepository.findPreviousChapter(courseId, currentSequenceOrder)
                .orElseThrow(() -> new ResourceNotFoundException("No previous chapter found"));

        return buildChapterResponse(previousChapter);
    }

    /* Build ChapterResponse DTO */
    private ChapterResponse buildChapterResponse(@NonNull Chapter chapter) {
        return ChapterResponse.builder()
                .id(chapter.getId())
                .courseId(chapter.getCourseId())
                .title(chapter.getTitle())
                .description(chapter.getDescription())
                .imageUrl(chapter.getImageUrl())
                .videoUrl(chapter.getVideoUrl())
                .videoDuration(chapter.getVideoDuration())
                .sequenceOrder(chapter.getSequenceOrder())
                .isCompleted(false)
                .isLocked(false)
                .createdAt(chapter.getCreatedAt())
                .build();
    }
}
