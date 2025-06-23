package dev.mvc.communitylike;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CommunitylikeService {

    @Autowired
    private CommunitylikeRepository communitylikeRepository;

    // 전체 목록 조회
    public List<Communitylike> findAll() {
        return communitylikeRepository.findAll();
    }

    // 좋아요 저장
    public Communitylike save(Communitylike communitylike) {
        return communitylikeRepository.save(communitylike);
    }

    // 좋아요 삭제
    public void deleteById(Long communitylike_no) {
        communitylikeRepository.deleteById(communitylike_no);
    }
}
