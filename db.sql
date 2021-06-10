-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Squences
CREATE SEQUENCE IF NOT EXISTS "Users_id_seq"

-- Table Definition
CREATE TABLE "public"."Users" (
    "id" int4 NOT NULL DEFAULT nextval('"Users_id_seq"'::regclass),
    "displayName" varchar NOT NULL,
    "email" varchar NOT NULL,
    "code" varchar,
    "password" varchar NOT NULL,
    "createdAt" timestamptz NOT NULL,
    "updatedAt" timestamptz NOT NULL,
    PRIMARY KEY ("id")
);

INSERT INTO "public"."Users" ("id", "displayName", "email", "code", "password", "createdAt", "updatedAt") VALUES
(3, 'nhutrancute', 'ngocnhu21042000@gmail.com', NULL, '$2b$10$uCP6GXe6y2gFpF6wjNrn4ea78xpGv8lzXSXW8jy9GB4bKURbfcOu6', '2021-05-28 11:53:54.884+07', '2021-05-28 11:54:35.372+07');
