--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3 (Debian 15.3-0+deb12u1)
-- Dumped by pg_dump version 15.3 (Debian 15.3-0+deb12u1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: anurag
--

CREATE SCHEMA drizzle;


ALTER SCHEMA drizzle OWNER TO anurag;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: anurag
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


ALTER TABLE drizzle.__drizzle_migrations OWNER TO anurag;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: anurag
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE drizzle.__drizzle_migrations_id_seq OWNER TO anurag;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: anurag
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: app_creds; Type: TABLE; Schema: public; Owner: anurag
--

CREATE TABLE public.app_creds (
    "appId" character varying(64) NOT NULL,
    client_id uuid,
    client_secret text
);


ALTER TABLE public.app_creds OWNER TO anurag;

--
-- Name: app_details; Type: TABLE; Schema: public; Owner: anurag
--

CREATE TABLE public.app_details (
    "appId" character varying(64) NOT NULL,
    redirect_uri character varying(200),
    homepage character varying(200),
    support_email character varying(100)
);


ALTER TABLE public.app_details OWNER TO anurag;

--
-- Name: app_info; Type: TABLE; Schema: public; Owner: anurag
--

CREATE TABLE public.app_info (
    "appId" character varying(64) NOT NULL,
    app_name character varying(32) NOT NULL,
    app_desc character varying(100),
    app_logo text,
    app_policy text,
    app_tos text
);


ALTER TABLE public.app_info OWNER TO anurag;

--
-- Name: apps; Type: TABLE; Schema: public; Owner: anurag
--

CREATE TABLE public.apps (
    "appId" character varying(64) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    uid character varying(32) NOT NULL
);


ALTER TABLE public.apps OWNER TO anurag;

--
-- Name: authseed; Type: TABLE; Schema: public; Owner: anurag
--

CREATE TABLE public.authseed (
    uid character varying(32) NOT NULL,
    sessions json DEFAULT '{}'::json
);


ALTER TABLE public.authseed OWNER TO anurag;

--
-- Name: client_access_seeds; Type: TABLE; Schema: public; Owner: anurag
--

CREATE TABLE public.client_access_seeds (
    uid character varying(32) NOT NULL,
    "appId" character varying(64) NOT NULL,
    seeds json DEFAULT '{}'::json,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.client_access_seeds OWNER TO anurag;

--
-- Name: users; Type: TABLE; Schema: public; Owner: anurag
--

CREATE TABLE public.users (
    id integer NOT NULL,
    uid character varying(32) NOT NULL,
    first_name character varying(32) NOT NULL,
    last_name character varying(32),
    email character varying(128) NOT NULL,
    password text NOT NULL,
    is_verified boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    is_developer boolean DEFAULT false NOT NULL
);


ALTER TABLE public.users OWNER TO anurag;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: anurag
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO anurag;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: anurag
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: anurag
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: anurag
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: anurag
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: app_creds app_creds_appId_unique; Type: CONSTRAINT; Schema: public; Owner: anurag
--

ALTER TABLE ONLY public.app_creds
    ADD CONSTRAINT "app_creds_appId_unique" PRIMARY KEY ("appId");


--
-- Name: app_details app_details_appId_unique; Type: CONSTRAINT; Schema: public; Owner: anurag
--

ALTER TABLE ONLY public.app_details
    ADD CONSTRAINT "app_details_appId_unique" PRIMARY KEY ("appId");


--
-- Name: app_info app_info_appId_unique; Type: CONSTRAINT; Schema: public; Owner: anurag
--

ALTER TABLE ONLY public.app_info
    ADD CONSTRAINT "app_info_appId_unique" PRIMARY KEY ("appId");


--
-- Name: apps apps_appId_unique; Type: CONSTRAINT; Schema: public; Owner: anurag
--

ALTER TABLE ONLY public.apps
    ADD CONSTRAINT "apps_appId_unique" PRIMARY KEY ("appId");


--
-- Name: authseed authseed_uid_unique; Type: CONSTRAINT; Schema: public; Owner: anurag
--

ALTER TABLE ONLY public.authseed
    ADD CONSTRAINT authseed_uid_unique PRIMARY KEY (uid);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: anurag
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_uid_unique; Type: CONSTRAINT; Schema: public; Owner: anurag
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_uid_unique PRIMARY KEY (uid);


--
-- Name: app_creds app_creds_appId_apps_appId_fk; Type: FK CONSTRAINT; Schema: public; Owner: anurag
--

ALTER TABLE ONLY public.app_creds
    ADD CONSTRAINT "app_creds_appId_apps_appId_fk" FOREIGN KEY ("appId") REFERENCES public.apps("appId");


--
-- Name: app_details app_details_appId_apps_appId_fk; Type: FK CONSTRAINT; Schema: public; Owner: anurag
--

ALTER TABLE ONLY public.app_details
    ADD CONSTRAINT "app_details_appId_apps_appId_fk" FOREIGN KEY ("appId") REFERENCES public.apps("appId");


--
-- Name: app_info app_info_appId_apps_appId_fk; Type: FK CONSTRAINT; Schema: public; Owner: anurag
--

ALTER TABLE ONLY public.app_info
    ADD CONSTRAINT "app_info_appId_apps_appId_fk" FOREIGN KEY ("appId") REFERENCES public.apps("appId");


--
-- Name: apps apps_uid_users_uid_fk; Type: FK CONSTRAINT; Schema: public; Owner: anurag
--

ALTER TABLE ONLY public.apps
    ADD CONSTRAINT apps_uid_users_uid_fk FOREIGN KEY (uid) REFERENCES public.users(uid);


--
-- Name: authseed authseed_uid_users_uid_fk; Type: FK CONSTRAINT; Schema: public; Owner: anurag
--

ALTER TABLE ONLY public.authseed
    ADD CONSTRAINT authseed_uid_users_uid_fk FOREIGN KEY (uid) REFERENCES public.users(uid);


--
-- Name: client_access_seeds client_access_seeds_appId_apps_appId_fk; Type: FK CONSTRAINT; Schema: public; Owner: anurag
--

ALTER TABLE ONLY public.client_access_seeds
    ADD CONSTRAINT "client_access_seeds_appId_apps_appId_fk" FOREIGN KEY ("appId") REFERENCES public.apps("appId");


--
-- Name: client_access_seeds client_access_seeds_uid_users_uid_fk; Type: FK CONSTRAINT; Schema: public; Owner: anurag
--

ALTER TABLE ONLY public.client_access_seeds
    ADD CONSTRAINT client_access_seeds_uid_users_uid_fk FOREIGN KEY (uid) REFERENCES public.users(uid);


--
-- PostgreSQL database dump complete
--

