package dev.mvc.sns.security;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;

public class CustomUser extends DefaultOAuth2User {

	private static final long serialVersionUID = 1L;
	
	private Long id;

	private String email;

	private String username;
	
	public CustomUser(Long id, String email, String username, Collection<? extends GrantedAuthority> authorities, OAuthAttributes attributes) {
		super(authorities, attributes.getAttributes(), attributes.getNameAttributeKey());
		
		this.id = id;
		this.email = email;
		this.username = username;
	}
	
	 public Long getId() {
	    return id;
	  } 
	 
	public String getEmail() {
		return email;
	}	
	
	public String getUsername() {
		return username;
	}
	
	@Override
	public String getName() {
		return "" + this.id;
	}
	
}
