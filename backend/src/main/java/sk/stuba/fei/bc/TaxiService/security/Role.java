package sk.stuba.fei.bc.TaxiService.security;

import lombok.Getter;

@Getter
public enum Role {
    ROLE_CUSTOMER("a2670b06e59a3719468a4936c9b98e0b2ef96a6e66c98fd4261b82929e97f542"),
    ROLE_ADMIN("1a404f408295aa6d5bc2f06d26f00974c61b94eb4599cb135088b5a5cf00a503"),
    ROLE_DRIVER("591d9b297f3845912efb9334b0dad3cbe49e830b7bfb9322c69fe5279144844b");

    private final String roleCipher;

    Role(String roleCipher) {
        this.roleCipher = roleCipher;
    }

}
