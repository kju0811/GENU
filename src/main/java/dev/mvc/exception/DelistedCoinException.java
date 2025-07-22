package dev.mvc.exception;
public class DelistedCoinException extends RuntimeException {
    public DelistedCoinException(String message) {
        super(message);
    }
}