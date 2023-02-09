SET timezone = "UTC";

CREATE TABLE "public"."user" (
    "id" SERIAL, 
    "username" text NOT NULL,
    "first_name" text NOT NULL,
    "last_name" text NOT NULL,
    "password" text NOT NULL,
    "created_at" timestamp without time zone DEFAULT now(),
    "is_admin" boolean NOT NULL DEFAULT 'false',
    PRIMARY KEY ("id")
);

CREATE TABLE user_favorite_movies (
    id SERIAL,
    user_id integer REFERENCES "user"(id) ON DELETE CASCADE,
    movie_id integer NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE user_watched_movies (
    id SERIAL,
    user_id integer NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    movie_id integer NOT NULL,
    rating integer,
    comments text,
    PRIMARY KEY ("id")
);

CREATE TABLE roles (
    id SERIAL,
    title text NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE user_roles (
    id SERIAL,
    user_id integer GENERATED ALWAYS AS IDENTITY REFERENCES "user"(id) ON DELETE CASCADE,
    role_id integer GENERATED ALWAYS AS IDENTITY REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY("id")
);

CREATE TABLE public.user_journal (
    id SERIAL,
    user_id integer GENERATED ALWAYS AS IDENTITY REFERENCES "user"(id) ON DELETE CASCADE, 
    movie_id integer NOT NULL,
    movie_title text,
    comment text,
    created_at timestamp without time zone DEFAULT now(),
    PRIMARY KEY ("id")
)
