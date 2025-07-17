package dev.mvc.news;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NewsRequestDTO {
    private String option1;
    private String option2;
    private String option3;
    private String result;
    private int news_no;
}