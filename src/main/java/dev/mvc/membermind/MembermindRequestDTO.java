package dev.mvc.membermind;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MembermindRequestDTO {
	private String name;
	private List<String> price;
	private List<String> cnt;
	private List<String> coin;
	private List<String> percent;
}
