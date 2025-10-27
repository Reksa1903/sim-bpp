--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.4 (Debian 17.4-1.pgdg120+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: balaiPenyuluhan
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO "balaiPenyuluhan";

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: balaiPenyuluhan
--

COMMENT ON SCHEMA public IS '';


--
-- Name: Day; Type: TYPE; Schema: public; Owner: balaiPenyuluhan
--

CREATE TYPE public."Day" AS ENUM (
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat'
);


ALTER TYPE public."Day" OWNER TO "balaiPenyuluhan";

--
-- Name: UserSex; Type: TYPE; Schema: public; Owner: balaiPenyuluhan
--

CREATE TYPE public."UserSex" AS ENUM (
    'PRIA',
    'WANITA'
);


ALTER TYPE public."UserSex" OWNER TO "balaiPenyuluhan";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Admin; Type: TABLE; Schema: public; Owner: balaiPenyuluhan
--

CREATE TABLE public."Admin" (
    id text NOT NULL,
    username text NOT NULL,
    email text,
    password text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Admin" OWNER TO "balaiPenyuluhan";

--
-- Name: DesaBinaan; Type: TABLE; Schema: public; Owner: balaiPenyuluhan
--

CREATE TABLE public."DesaBinaan" (
    id text NOT NULL,
    name text NOT NULL,
    "penyuluhId" text
);


ALTER TABLE public."DesaBinaan" OWNER TO "balaiPenyuluhan";

--
-- Name: DokumentasiAcara; Type: TABLE; Schema: public; Owner: balaiPenyuluhan
--

CREATE TABLE public."DokumentasiAcara" (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    photo text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    "penyuluhId" text
);


ALTER TABLE public."DokumentasiAcara" OWNER TO "balaiPenyuluhan";

--
-- Name: Kegiatan; Type: TABLE; Schema: public; Owner: balaiPenyuluhan
--

CREATE TABLE public."Kegiatan" (
    title text NOT NULL,
    description text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    day public."Day" NOT NULL,
    "penyuluhId" text,
    id text NOT NULL
);


ALTER TABLE public."Kegiatan" OWNER TO "balaiPenyuluhan";

--
-- Name: KelompokTani; Type: TABLE; Schema: public; Owner: balaiPenyuluhan
--

CREATE TABLE public."KelompokTani" (
    id text NOT NULL,
    name text NOT NULL,
    ketua text NOT NULL,
    phone text NOT NULL,
    address text NOT NULL,
    img text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "desaBinaanId" text,
    username text NOT NULL,
    "luasArea" double precision
);


ALTER TABLE public."KelompokTani" OWNER TO "balaiPenyuluhan";

--
-- Name: KiosPengumuman; Type: TABLE; Schema: public; Owner: balaiPenyuluhan
--

CREATE TABLE public."KiosPengumuman" (
    id text NOT NULL,
    "kiosPertanianId" text,
    "pengumumanId" text NOT NULL
);


ALTER TABLE public."KiosPengumuman" OWNER TO "balaiPenyuluhan";

--
-- Name: KiosPertanian; Type: TABLE; Schema: public; Owner: balaiPenyuluhan
--

CREATE TABLE public."KiosPertanian" (
    id text NOT NULL,
    name text NOT NULL,
    owner text NOT NULL,
    address text NOT NULL,
    phone text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    img text
);


ALTER TABLE public."KiosPertanian" OWNER TO "balaiPenyuluhan";

--
-- Name: Materi; Type: TABLE; Schema: public; Owner: balaiPenyuluhan
--

CREATE TABLE public."Materi" (
    title text NOT NULL,
    "fileName" text NOT NULL,
    "fileUrl" text NOT NULL,
    "uploadDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updateDate" timestamp(3) without time zone NOT NULL,
    "penyuluhId" text,
    id text NOT NULL
);


ALTER TABLE public."Materi" OWNER TO "balaiPenyuluhan";

--
-- Name: Pengumuman; Type: TABLE; Schema: public; Owner: balaiPenyuluhan
--

CREATE TABLE public."Pengumuman" (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "penyuluhId" text,
    "kelompokTaniId" text,
    "desaBinaanId" text
);


ALTER TABLE public."Pengumuman" OWNER TO "balaiPenyuluhan";

--
-- Name: Penyuluh; Type: TABLE; Schema: public; Owner: balaiPenyuluhan
--

CREATE TABLE public."Penyuluh" (
    id text NOT NULL,
    username text NOT NULL,
    name text NOT NULL,
    email text,
    phone text NOT NULL,
    address text NOT NULL,
    img text,
    bidang text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    birthday timestamp(3) without time zone NOT NULL,
    gender public."UserSex" NOT NULL,
    surname text NOT NULL
);


ALTER TABLE public."Penyuluh" OWNER TO "balaiPenyuluhan";

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: balaiPenyuluhan
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO "balaiPenyuluhan";

--
-- Data for Name: Admin; Type: TABLE DATA; Schema: public; Owner: balaiPenyuluhan
--

COPY public."Admin" (id, username, email, password, "createdAt") FROM stdin;
2ccf51ed-41bc-4a3f-851d-fe4cfdfb8c56	admin1	admin1@example.com	admin123	2025-10-11 15:22:31.9
9b92bdbe-9801-4be4-97fa-ef2babe91a96	admin2	admin2@example.com	admin123	2025-10-11 15:22:31.9
\.


--
-- Data for Name: DesaBinaan; Type: TABLE DATA; Schema: public; Owner: balaiPenyuluhan
--

COPY public."DesaBinaan" (id, name, "penyuluhId") FROM stdin;
9b1ad054-5148-4a43-a5f9-9de9fbc1fa91	Desa Longkeyang	user_349iBnPRZanZRY5C12Wyiv7wU84
fbecc3af-a441-4482-a64e-2ce05033ab56	Desa Gunungbatu	user_349iBnPRZanZRY5C12Wyiv7wU84
46608e43-9c09-4ab1-a63e-b7bd663a33b6	Desa Pasir	user_349iBnPRZanZRY5C12Wyiv7wU84
a56d8f9f-4d1a-4634-8d3a-1b5b646d1011	Desa Babakan	user_349iBnPRZanZRY5C12Wyiv7wU84
6d1b7283-08bb-46c4-8559-ed05bae727bc	Desa Kwasen	user_349rcujFEPuERx5YoJ4Dfn9bsd0
255a541d-5913-4960-b7e2-b7757c9c2ab5	Desa Kebandungan	user_349rcujFEPuERx5YoJ4Dfn9bsd0
cf5067ca-1af0-410e-8d7f-7916eb8bc313	Desa Kesesirejo	user_349rcujFEPuERx5YoJ4Dfn9bsd0
2c9e0c27-5b6e-4cb1-b2cf-83e30ef121c5	Desa Kelangdepok	e947c353-1892-431e-9674-aee6e10bb91c
63af6ee4-9f7e-4aee-9d88-1cc60ad87965	Desa Pendowo	e947c353-1892-431e-9674-aee6e10bb91c
cdaf805f-eb5d-4fb0-a200-fe7d457e469a	Desa Bodeh	e947c353-1892-431e-9674-aee6e10bb91c
70230c2f-cbe4-4644-836a-aba976358abd	Desa Muncang	e947c353-1892-431e-9674-aee6e10bb91c
db8268eb-93cc-41b9-9062-0a9d0d08d864	Desa Karangbrai	user_34ELhC6AxDAdzsL8cmSbB9fHXJQ
74c3e5cb-676d-4765-a067-4bada3b8eaf8	Desa Jraganan	user_34ELhC6AxDAdzsL8cmSbB9fHXJQ
500d2435-be74-4f0b-a964-f31a02487778	Desa Kebandaran	user_34ELhC6AxDAdzsL8cmSbB9fHXJQ
c4373fb8-c939-4924-a066-719646e0cabe	Desa Cangak	user_34ELhC6AxDAdzsL8cmSbB9fHXJQ
f3e26f1f-8be6-4d98-9d5f-bbae063deaf3	Desa Jatingarang	user_34Ffoy7n3Gg7XGspJQVclJPTcv2
1d831031-f5d8-40ab-a66a-62644c05bed3	Desa Jatiroyom	user_34Ffoy7n3Gg7XGspJQVclJPTcv2
55252aac-766e-4144-b402-c3255236719b	Desa Parunggalih	user_34Ffoy7n3Gg7XGspJQVclJPTcv2
737535e1-c18d-4fa6-a7bd-aedc365f1e3d	Desa Payung	user_34Ffoy7n3Gg7XGspJQVclJPTcv2
\.


--
-- Data for Name: DokumentasiAcara; Type: TABLE DATA; Schema: public; Owner: balaiPenyuluhan
--

COPY public."DokumentasiAcara" (id, title, description, photo, date, "penyuluhId") FROM stdin;
bac496fd-bc57-44d4-ad35-ddc457c583e9	Dokumentasi 7	Deskripsi dokumentasi 7	/photos/doc7.jpg	2025-10-11 15:22:32.137	\N
fd83b545-ad63-4585-b3c6-c08a04183ad4	Dokumentasi 3	Deskripsi dokumentasi 3	/photos/doc3.jpg	2025-10-11 15:22:32.128	\N
957e009f-4b90-4846-9ced-e2cbbd2ed24e	Dokumentasi 6	Deskripsi dokumentasi 6	/photos/doc6.jpg	2025-10-11 15:22:32.135	\N
ce2fb826-54fe-4747-b621-d4c64c67e6ed	Dokumentasi 8	Deskripsi dokumentasi 8	/photos/doc8.jpg	2025-10-11 15:22:32.139	\N
f5ad31f5-2fae-4358-89b0-a10affb15667	Dokumentasi 10	Deskripsi dokumentasi 10	/photos/doc10.jpg	2025-10-11 15:22:32.143	\N
46ec6d26-eeb6-45b6-a162-540d7c2b3de2	Dokumentasi 2	Deskripsi dokumentasi 2	/photos/doc2.jpg	2025-10-11 15:22:32.126	\N
8bd5826f-64bc-4ed7-a16a-bfe380cdf55a	Testing dulu	Testing dulu aja	/photos/cf64d636-b91f-4ad2-8c05-2b4bdb2f0fc1-WhatsApp Image 2025-02-10 at 09.07.31 (6).jpeg	2025-10-10 00:00:00	\N
e6d27452-ef62-4ae0-b3b4-22c5ee3b3465	test	test	/photos/42d48bbb-bda0-4843-a834-628221e292b8-WhatsApp Image 2025-02-17 at 15.14.28 (1).jpeg	2025-10-14 00:00:00	\N
a2baad57-bcb6-41e4-954f-d131453b67b1	Dokumentasi 4	Deskripsi dokumentasi 4	/photos/doc4.jpg	2025-10-11 15:22:32.13	\N
3eb3dd91-118a-49e2-bf93-3b7e7ec6a72c	Dokumentasi 9	Deskripsi dokumentasi 9	/photos/doc9.jpg	2025-10-11 15:22:32.141	\N
b2660ac7-d586-4437-b25b-ab18ea5f2e85	Dokumentasi 1	Deskripsi dokumentasi 1	/photos/doc1.jpg	2025-10-11 15:22:32.123	\N
\.


--
-- Data for Name: Kegiatan; Type: TABLE DATA; Schema: public; Owner: balaiPenyuluhan
--

COPY public."Kegiatan" (title, description, "startDate", "endDate", day, "penyuluhId", id) FROM stdin;
Kegiatan Hari Kamis	Deskripsi kegiatan hari Kamis	2025-07-24 01:00:00	2025-07-24 03:00:00	Kamis	\N	5403ca44-944f-4c04-96b8-5c976cb6acd9
Kegiatan Hari Rabu	Deskripsi kegiatan hari Rabu	2025-07-23 01:00:00	2025-07-23 03:00:00	Rabu	\N	cea1a353-8fcf-442d-b4f6-348dbc873650
Kegiatan Hari Jumat	Deskripsi kegiatan hari Jumat	2025-07-25 01:00:00	2025-07-25 03:00:00	Jumat	\N	86f39f20-106e-4635-8cea-61fb202edcd8
Kegiatan Hari Selasa	Deskripsi kegiatan hari Selasa	2025-07-22 01:00:00	2025-07-22 03:00:00	Selasa	\N	b747de69-5611-4dab-b9f4-c2b29c1d7be4
\.


--
-- Data for Name: KelompokTani; Type: TABLE DATA; Schema: public; Owner: balaiPenyuluhan
--

COPY public."KelompokTani" (id, name, ketua, phone, address, img, "createdAt", "desaBinaanId", username, "luasArea") FROM stdin;
user_34FnIE9uK3Su3GMJbhNcetQC3EO	Gunung Sari	Suyatno	082328158762	Payung	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760818103/uc2lixsy4pwdqiqsop46.jpg	2025-10-18 20:08:25.931	737535e1-c18d-4fa6-a7bd-aedc365f1e3d	KT-69-Gunung_Sari	12
user_349sjXqLfznYMK4dyjAj3ToB0U1	Tani Makmur	Ismail	085225053935	Kebandungan	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760637254/n0znxrstbhoxbt63egp1.jpg	2025-10-16 17:54:17.273	255a541d-5913-4960-b7e2-b7757c9c2ab5	KT-03-Tani_Makmur	38
user_34BVCPpNskFQpyZ8DvNEvaFbvaQ	Sari Dewi	Waluyo	085326834030	Kesesirejo	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760686816/j2bb9lofyylz0hm4tscf.jpg	2025-10-17 07:40:23.144	cf5067ca-1af0-410e-8d7f-7916eb8bc313	KT-06-Sari_Dewi	56
user_349qUqpMGaBN8JjsCdeys7WwjYc	Terang	Tarjuni	082326995050	Babakan	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760636026/htnsevrvwpszwh5gsygh.jpg	2025-10-16 17:35:52.907	a56d8f9f-4d1a-4634-8d3a-1b5b646d1011	KT-21-Terang	60
user_349j0L8cFobgJZ0XBiATHPrYTNk	Loh Jinawi	Cartam	082137497357	Longkeyang	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760632450/nmwg0fzlf82tmmyj9fxn.jpg	2025-10-16 16:34:17.139	9b1ad054-5148-4a43-a5f9-9de9fbc1fa91	KT-10-Loh_Jinawi	48
user_34BVSKJS2u4i8eGZIOMxKSlaSHA	Tani Mulyo	Wasisto	087733391382	Kesesirejo	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760686889/y0de9t2alru3jty6n7mk.jpg	2025-10-17 07:42:30.376	cf5067ca-1af0-410e-8d7f-7916eb8bc313	KT-07-Tani_Mulyo	49
user_349rzaTTRwmhNyF8PgcEWVEr0J0	Tani Makmur	Suhermanto	085800506204	Kwasen	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760636886/xbyohu1umlnxantcbmz0.jpg	2025-10-16 17:48:10.432	6d1b7283-08bb-46c4-8559-ed05bae727bc	KT-01-Tani_Makmur	38
user_349sMYi1qexNKTC0sPXu6NyK2TJ	Tani Arimbi	Suwardi	085229453544	Kwasen	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760637071/jfeg7lhprvtmmwxthiaw.jpg	2025-10-16 17:51:14.074	6d1b7283-08bb-46c4-8559-ed05bae727bc	KT-02-Tani_Arimbi	52
user_349jdcrAU4ld0JighEqLUmC7oha	Khismo Budoyo	Suyatno	082326861857	Longkeyang	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760632761/ut5qjzzu00dhn7v295xi.jpg	2025-10-16 16:39:28.555	9b1ad054-5148-4a43-a5f9-9de9fbc1fa91	KT-11-Khismo_Budoyo	39
user_34BVgsz3AcupsKGKF1U5PdEvrOB	Tani Subur	Martono	082325622856	Kesesirejo	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760687021/nubfjpbnkffnly2vrtsz.jpg	2025-10-17 07:44:27.212	cf5067ca-1af0-410e-8d7f-7916eb8bc313	KT-08-Tani_Subur	67
user_349k6GYzoDpQVyLhQhRr4icRCE1	Harapan	Arfai	085293762510	Longkeyang	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760632992/chjzuuard7vf9i5qyuz5.jpg	2025-10-16 16:43:17.199	9b1ad054-5148-4a43-a5f9-9de9fbc1fa91	KT-12-Harapan	37
user_349tEO0w2zYkmWaNheRKUMWnqvy	Tani Karya	Budi Utomo	085329415400	Kebandungan	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760637499/lmqpvkeirhklbmji7klx.jpg	2025-10-16 17:58:21.849	255a541d-5913-4960-b7e2-b7757c9c2ab5	KT-04-Tani_Karya	40
user_34BURojViFKS65jdEMDI24DMB2Z	Dewi Sri	Tayono	085866052486	Kesesirejo	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760686447/papbgfkrwlfe8rqecfdo.jpg	2025-10-17 07:34:12.711	cf5067ca-1af0-410e-8d7f-7916eb8bc313	KT-05-Dewi_Sri	51
user_349n6OAjMqQzWBIJtpuzeObWFqB	Tani Jaya	Kasmo	082243043224	Longkeyang	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760634473/mxmtgmecyavejfcpzj8g.jpg	2025-10-16 17:07:57.694	9b1ad054-5148-4a43-a5f9-9de9fbc1fa91	KT-09-Tani_Jaya	40
user_349kak5wggFabhzKlko8RruEkHx	Pelita	Ramoyo	089876543123	Longkeyang	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760633208/ouku5g8xnwljoh9e0pjg.jpg	2025-10-16 16:47:20.452	9b1ad054-5148-4a43-a5f9-9de9fbc1fa91	KT-13-Pelita	54
user_349nZRz5mpmbR6rPXH4gKdCbOSU	Sugih Waras	Hasan Hariri	082313089212	Gungungbatu	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760634706/omozpr1yra1zt2nlhxj2.png	2025-10-16 17:11:50.23	fbecc3af-a441-4482-a64e-2ce05033ab56	KT-14-Sugih_Waras	27
user_349nlTXBcJOaJzQTfzgcZ6cYdlM	Sumber Makmur	Ali Sodirin	082322662188	Gungungbatu	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760634802/naafvqkjuiuicohuhbq7.png	2025-10-16 17:13:24.88	fbecc3af-a441-4482-a64e-2ce05033ab56	KT-15-Sumber_Makmur	24
user_349nye2SzvX1aIfH1I1alnMmGIv	Rizki Tani	Taryono	082323529586	Gungungbatu	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760634903/rqbanunfsx0sqymbs7v3.png	2025-10-16 17:15:09.962	fbecc3af-a441-4482-a64e-2ce05033ab56	KT-16-Rizki_Tani	20
user_349oDOR3oJe48v5WF4yXhrPS0sz	Berkah Tani	Basori	085229011173	Gungungbatu	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760635023/o83apmgqu3boiwmck1a1.png	2025-10-16 17:17:06.73	fbecc3af-a441-4482-a64e-2ce05033ab56	KT-17-Berkah_Tani	20
user_349oqXY3ouFWutQdOtp3n94HTfP	Kendi Kebek	Puput Hakim	088983243027	Pasir	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760635336/oinr7re4gc0gorvjmhbl.jpg	2025-10-16 17:22:19.134	46608e43-9c09-4ab1-a63e-b7bd663a33b6	KT-18-Kendi_Kebek	37
user_349pHG0DsUFi1SW6ivLJUPQsPgD	Gondang Sari	Ari Sudarsono	082220661956	Pasir	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760635548/nopyqpdmduu5hjbultkw.jpg	2025-10-16 17:25:51.834	46608e43-9c09-4ab1-a63e-b7bd663a33b6	KT-19-Gondang_Sari	51
user_349phvfi06FtxDUhNaInxHlYYLe	Sri Jati	Sobirin	085292347384	Pasir	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760635706/l8xrf8rn6qzauxyxp8av.jpg	2025-10-16 17:29:24.426	46608e43-9c09-4ab1-a63e-b7bd663a33b6	KT-20-Sri_Jati	55
user_349quO1KWhOJCG7fAINz9EqOryR	Ketat	Samhudi	082325302143	Babakan	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760636263/vuukbldoiygx92z6v9qq.jpg	2025-10-16 17:39:15.906	a56d8f9f-4d1a-4634-8d3a-1b5b646d1011	KT-22-Ketat	48
user_34EGZIp3gnNqsoJW9wlxLid7kzY	Tani Mandiri	Risyanto	081901091115	Pendowo	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760771367/hgplbdifxogyqpf1yyph.jpg	2025-10-18 07:09:30.643	63af6ee4-9f7e-4aee-9d88-1cc60ad87965	KT-30-Tani_Mandiri	34
user_34EMaKYTGfhvTZqYE0xdkRPGH79	Makmur	Kasan Bisri	085713234273	Karangbrai	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760774336/ns4n8wntuz2pizuftjxa.jpg	2025-10-18 07:58:58.42	db8268eb-93cc-41b9-9062-0a9d0d08d864	KT-42-Makmur	41
user_34EKwpx5lNBTds4Hqn5WMKLMbMd	Geger Pethung	Sukro	085890492419	Muncang	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760773529/idrjdrakxjpmvozk4knq.jpg	2025-10-18 07:45:32.039	70230c2f-cbe4-4644-836a-aba976358abd	KT-37-Geger_Pethung	16
user_34ENV9tIMDJ2oVZjzHbSkTET1pb	Maju Makmur	Madkur	087824254840	Karangbrai	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760774788/fa2mgwwpl5njitfg0maw.jpg	2025-10-18 08:06:30.836	db8268eb-93cc-41b9-9062-0a9d0d08d864	KT-45-Maju_Makmur	39
user_34BXNdpTHFzeubu8YH2ZnUtFhU4	Tani Sadar	Surono	082324348584	Kelangdepok	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760687775/jnxuyaldaojnweai8z4f.jpg	2025-10-17 07:58:19.514	2c9e0c27-5b6e-4cb1-b2cf-83e30ef121c5	KT-23-Tani_Sadar	19
user_34BZRB0zogdlXEAif8MiWcoVv5M	Lumayan	Ismail	081802870159	Kelangdepok	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760688868/tef8jo5howqsqxlnmmpy.jpg	2025-10-17 08:15:14.345	2c9e0c27-5b6e-4cb1-b2cf-83e30ef121c5	KT-24-Lumayan	32
user_34EEyQxVOYGoFhNsDwSkJxDv4RR	Sido Makmur	Nurkholili	081931800911	Kelangdepok	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760770581/polpzlrtepp0htcooupm.jpg	2025-10-18 06:56:23.891	2c9e0c27-5b6e-4cb1-b2cf-83e30ef121c5	KT-25-Sido_Makmur	25
user_34EFCslH4v1VpW3vWtae2dAakAe	Tani Mantep	Amar Ahmad	081327260588	Kelangdepok	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760770696/menxrbujbv6genrefpyx.jpg	2025-10-18 06:58:19.519	2c9e0c27-5b6e-4cb1-b2cf-83e30ef121c5	KT-26-Tani_Mantep	28
user_34EFSMxyIvn6pV1sREUljoVllRN	Sederhana	Ali Sodikin	085329544777	Kelangdepok	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760770820/faosclgeivuayikrp6cu.jpg	2025-10-18 07:00:21.927	2c9e0c27-5b6e-4cb1-b2cf-83e30ef121c5	KT-27-Sederhana	30
user_34EFvGU0u31GMc08Qh5tK9XZdLf	Tani Maju	Rohmani	082324726334	Pendowo	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760771048/eq3r8a8pwu4luh7mqfgq.jpg	2025-10-18 07:04:11.75	63af6ee4-9f7e-4aee-9d88-1cc60ad87965	KT-28-Tani_Maju	27
user_34EGKIU3y7RYS0k0VbFWLh3Kxqe	Tani Makmur	Hadi Waluyo	085225725704	Pendowo	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760771248/fr6xcdgesurjjlhrjrwg.jpg	2025-10-18 07:07:31.072	63af6ee4-9f7e-4aee-9d88-1cc60ad87965	KT-29-Tani_Makmur	42
user_34EGpHmaq0mPTd5STcrjGc2VTvv	Sibanteng	Nurhasan	08122992312	Pendowo	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760771495/meviwancldsgobftbl7j.jpg	2025-10-18 07:11:37.434	63af6ee4-9f7e-4aee-9d88-1cc60ad87965	KT-31-Sibanteng	34
user_34EJHR2L6mTZVLJfWFnIzvE4Tsp	Ujung Alit	Umar	082313996070	Muncang	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760772654/ywue2dl5a3twwwlqyp38.jpg	2025-10-18 07:31:49.217	70230c2f-cbe4-4644-836a-aba976358abd	KT-32-Ujung_Alit	42
user_34EIeUBMooo8RzvogT7nSwjvU4D	Ngudi Mulyo	Wahadi	085290504633	Bodeh	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760772396/ytx2pns4kbam7rkhw0l6.jpg	2025-10-18 07:26:38.959	cdaf805f-eb5d-4fb0-a200-fe7d457e469a	KT-40-Ngudi_Mulyo	31
user_34EJxcKHbrMuDRRi2xyUIz8COHH	Tani Dewi	Siswadi	085842326688	Muncang	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760773040/hscrxri2ripz1boo4btz.jpg	2025-10-18 07:37:23.613	70230c2f-cbe4-4644-836a-aba976358abd	KT-34-Tani_Dewi	24
user_34EKGdsIwnOqmeaA9VkV0LqcLIi	Lestari	Sobirin	085725401469	Muncang	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760773162/dtk9uhpd9hecfc04tirn.jpg	2025-10-18 07:39:56.044	70230c2f-cbe4-4644-836a-aba976358abd	KT-36-Lestari	29
user_34EJcX7ENvY3Z0IKaKeOIeL5gsO	Tani Sinta	Sumitro	085725401467	Muncang	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760772874/fktu951dglethx1utsgb.jpg	2025-10-18 07:34:36.438	70230c2f-cbe4-4644-836a-aba976358abd	KT-33-Tani_Sinta	31
user_34EHvcg7kwrnLo1c519fcJqk2dq	Puri Indah	Cahyono	085290592728	Bodeh	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760772039/qbvvuqxwdn0ozms8f2rh.jpg	2025-10-18 07:20:42.006	cdaf805f-eb5d-4fb0-a200-fe7d457e469a	KT-38-Puri_Indah	32
user_34EINbJw8Kmg2gvX394G0FCLiq1	Tani Mulyo	Taryani	085643241158	Bodeh	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760772254/gwuyytkaauciky9uclaq.jpg	2025-10-18 07:24:25.147	cdaf805f-eb5d-4fb0-a200-fe7d457e469a	KT-39-Tani_Mulyo	21
user_34EMFApAwpKwkQzQxm3tF4XO7aI	Tani Makmur	M. Usman Kharis	082325703885	Karangbrai	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760774168/oqo8nsrv9pwkrhatcs99.jpg	2025-10-18 07:56:11.128	db8268eb-93cc-41b9-9062-0a9d0d08d864	KT-41-Tani_Makmur	73
user_34EMqkBfNfTy3U4OW8ArW3vvbMO	Sumber Makmur	Dalari	085385160060	Karangbrai	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760774467/nfhxbrjyi1bglt5hbfcv.jpg	2025-10-18 08:01:09.777	db8268eb-93cc-41b9-9062-0a9d0d08d864	KT-43-Sumber_Makmur	27
user_34ENGrY7PYzl1ou3nL38wios8Ln	Cita Makmur	Dul Basir	085733038586	Karangbrai	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760774668/jxwgzjbwt4akyrzl5zcu.jpg	2025-10-18 08:04:38.168	db8268eb-93cc-41b9-9062-0a9d0d08d864	KT-44-Cita_Makmur	27
user_34ENkPv4D6r9jgjK2H5meMWWs5T	Harapan Makmur	Achmad Sodikin	085290538963	Karangbrai	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760774870/g0ms4fxy6cdxz9exgiul.jpg	2025-10-18 08:08:32.563	db8268eb-93cc-41b9-9062-0a9d0d08d864	KT-46-Harapan_Makmur	34
user_34FZHu2tLG51m3bhLrnGV79cA5U	Dewi Sri	Casmudi	082328753559	Jraganan	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760811168/ygy0dfoso39xeje38lu7.jpg	2025-10-18 18:13:15.955	74c3e5cb-676d-4765-a067-4bada3b8eaf8	KT-47-Dewi_Sri	27
user_34FZVtXiLpiDSUYxC2UyikxZlUf	Dewi Ratih	Tukijan	085848122429	Jraganan	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760811285/zlr3ksqfed2by7loxlrx.jpg	2025-10-18 18:15:06.128	74c3e5cb-676d-4765-a067-4bada3b8eaf8	KT-48-Dewi_Ratih	51
user_34FaYCxBppP20tyMc98Ibfcg2OG	Tulus Karya I	H. Dahroji	085700651809	Kebandaran	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760811800/uqmoj9zvutjspialtrjj.jpg	2025-10-18 18:23:38.687	500d2435-be74-4f0b-a964-f31a02487778	KT-49-Tulus_Karya_I	60
user_34Fals3262nr5lH9soc32JAeLa0	Tulus Karya II	Rohman	085229896591	Kebandaran	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760811924/trjeebiyhli34l56rfox.jpg	2025-10-18 18:25:27.361	500d2435-be74-4f0b-a964-f31a02487778	KT-50-Tulus_Karya_II	27
user_34FbWDV3hk5NxUSErpdCFWKQ8Fl	Sri Rahayu	Abdullah Faqih	082328638233	Cangak	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760812255/r8sdv97e95oo0fyd2kbx.jpg	2025-10-18 18:31:36.28	c4373fb8-c939-4924-a066-719646e0cabe	KT-51-Sri_Rahayu	11
user_34Fbu3zpC54dGrzJm9m4ws0YJNO	Gemah Ripah	Jamroni	083103085641	Cangak	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760812436/e0iwidjuohhp4xoaef3y.jpg	2025-10-18 18:34:45.94	c4373fb8-c939-4924-a066-719646e0cabe	KT-52-Gemah_Ripah	35
user_34FhB1KxLZ9wDJRmIggHa4RoJnz	Karya Tani	Driyono	085225783547	Jatingarang	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760815065/xyiwar35foevuxfec6fg.jpg	2025-10-18 19:18:07.332	f3e26f1f-8be6-4d98-9d5f-bbae063deaf3	KT-53-Karya_Tani	46
user_34FhPbiJlYGGIeculoty9rgaKqv	Tani Makmur	Abdul Gopur	087817134675	Jatingarang	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760815146/fxlwlinr2meuxcze1two.jpg	2025-10-18 19:20:03.749	f3e26f1f-8be6-4d98-9d5f-bbae063deaf3	KT-54-Tani_Makmur	43
user_34FhchYY8quCG8MWNRFfW5qCeEA	Citarum	Ruslani	087817134667	Jatingarang	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760815291/f7i24yhmnkvl3mumjxng.jpg	2025-10-18 19:21:48.194	f3e26f1f-8be6-4d98-9d5f-bbae063deaf3	KT-55-Citarum	64
user_34FhloKUpAbSkq7WhlYhOUFr4rV	Gemah Ripah	Suwuk	082325536885	Jatingarang	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760815356/i4rrbflwow6b99jm75ds.jpg	2025-10-18 19:23:00.125	f3e26f1f-8be6-4d98-9d5f-bbae063deaf3	KT-56-Gemah_Ripah	51
user_34FhwIdPHypSMh9Lmgb2NvnhQeh	Tani Maju	Tarjo	082324215622	Jatingarang	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760815437/nodleyufyl6i9mv3faui.jpg	2025-10-18 19:24:23.298	f3e26f1f-8be6-4d98-9d5f-bbae063deaf3	KT-57-Tani_Maju	69
user_34Fi6xjA0YeKuZJMNXY9LEPYakt	Karya Wisma	Yuswanto	082327208043	Jatingarang	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760815544/li0be9i2fkxsbwelp3ry.jpg	2025-10-18 19:25:48.64	f3e26f1f-8be6-4d98-9d5f-bbae063deaf3	KT-58-Karya_Wisma	51
user_34FiFpwARRfPlXKpEwWhkqAo9EF	Sido Makmur	Sahudin	085226270720	Jatingarang	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760815602/phh82m2nb0yjerl51k4d.jpg	2025-10-18 19:26:59.536	f3e26f1f-8be6-4d98-9d5f-bbae063deaf3	KT-59-Sido_Makmur	50
user_34FiQBHAsR3cyhiryP6rZX0CiRw	Subur Makmur	Wartoyo	082322370877	Jatingarang	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760815698/jdksij469rvyghbk0glt.jpg	2025-10-18 19:28:21.465	f3e26f1f-8be6-4d98-9d5f-bbae063deaf3	KT-60-Subur_Makmur	68
user_34FjwPOnX4KFSvpVJRDQgAcTmQN	Guna Tani	Heru Kurnianto	085290121067	Jatiroyom	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760816481/qtp94xqjj2omj8h38glf.jpg	2025-10-18 19:40:51.33	1d831031-f5d8-40ab-a66a-62644c05bed3	KT-61-Guna_Tani	25
user_34FkIKELLSkaemcUPh4hXTutqnd	Dewi Mukti	Rismanto	085870760389	Jatiroyom	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760816572/j03iexy6qm5hxdyj3x35.jpg	2025-10-18 19:43:46.065	1d831031-f5d8-40ab-a66a-62644c05bed3	KT-62-Dewi_Mukti	28
user_34FkS0fO9hejbPvijIRVpWOKJpt	Tani Harapan	Yasin	085869030504	Jatiroyom	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760816700/dlu4gbl4fssitcd6fkmg.jpg	2025-10-18 19:45:03.088	1d831031-f5d8-40ab-a66a-62644c05bed3	KT-63-Tani_Harapan	30
user_34FkfKURKIScJN29YvsVGSiiPt6	Jati Makmur	Heriyanto	082328231829	Jatiroyom	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760816786/he4tqxgggtrqtfduvvss.jpg	2025-10-18 19:46:49.336	1d831031-f5d8-40ab-a66a-62644c05bed3	KT-64-Jati_Makmur	35
user_34FkoUyOZfWiffeRnRcfR3vX3Gw	Sumber Makmur	Sugiri	087715491686	Jatiroyom	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760816858/pem7osgcg6fhjk85zq81.jpg	2025-10-18 19:48:02.946	1d831031-f5d8-40ab-a66a-62644c05bed3	KT-65-Sumber_Makmur	29
user_34FmEdFIEj89NTRMPCkMahry68x	Sumber Waras	Agusaeri	085329800593	Parunggalih	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760817578/uyejdp8g4m19vj3blcjh.jpg	2025-10-18 19:59:43.915	55252aac-766e-4144-b402-c3255236719b	KT-66-Sumber_Waras	12
user_34FmVhZiNf4aenL2SR6LyfwiB0K	Harapan Mulya	Munasikin	082325623644	Parunggalih	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760817648/l9mapm2bgc1radhzmtl0.jpg	2025-10-18 20:01:59.811	55252aac-766e-4144-b402-c3255236719b	KT-67-Harapan_Mulya	19
user_34Fn1IzvVn3VHLfKEc3KcaloWbT	Tani Jaya	Agus Tarmuji	085326733275	Payung	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760817909/eemmrknb9umuibqqgbbf.jpg	2025-10-18 20:06:10.282	737535e1-c18d-4fa6-a7bd-aedc365f1e3d	KT-68-Tani_Jaya	13
\.


--
-- Data for Name: KiosPengumuman; Type: TABLE DATA; Schema: public; Owner: balaiPenyuluhan
--

COPY public."KiosPengumuman" (id, "kiosPertanianId", "pengumumanId") FROM stdin;
e7cd36f0-53e0-40ac-945c-bd93ccbbba63	\N	df502260-19d3-48e5-aa9e-53d550e32695
b00b4cd2-4036-4184-9b22-23716129849b	\N	399ad1a7-e4bd-4fb5-9724-e35705fdd715
96c816ec-4cfe-4391-bdea-d48c4e899e0a	\N	77d4ef1d-7ae5-4126-8468-279886cd3ff6
220018d4-1aa4-49e4-95c1-c49e1dec85ed	\N	ac935a20-75e5-4f44-ae9c-9de2b2f07b65
15c94438-9e48-4962-9f8f-f1fe74eb3ae8	\N	1641d266-0fcf-4c03-a8b9-37e5b1f152d4
26bd5b0e-7831-4bd3-ab28-6ea3e2a4ccc9	\N	aaacb052-a3bc-4b89-a65e-0f7bdd93bf24
f197fa19-c6ac-4c5d-95a8-a4fec9343c9a	\N	f5ca1640-c574-4a75-a2c4-64c905c25132
198e433a-adcc-4d2b-b478-1ca7bc11aba4	\N	22a7a2e9-154f-464d-9836-bc763d76a8b1
9ba428ba-c545-41ab-90bf-7b228fd1d7e8	\N	d2a103d9-efd0-4ba2-949a-f6efde8943d9
\.


--
-- Data for Name: KiosPertanian; Type: TABLE DATA; Schema: public; Owner: balaiPenyuluhan
--

COPY public."KiosPertanian" (id, name, owner, address, phone, "createdAt", img) FROM stdin;
97d4f578-e13d-4449-9e13-797acf120e70	Kios Lancar Jaya	Pemilik 1	Desa Longkeyang	082125120351	2025-10-19 14:33:43.86	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760884321/sin41ktzersqmkowgsna.png
ae05a272-3600-4998-9e3b-28f462597204	Kios Maju Tani	Pemilik 2	Desa Jatingarang	082325920243	2025-10-19 14:46:07.151	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760885165/xhlbowaxcp3do3zluork.png
2b0369de-12a1-42aa-a952-42fb8ef980c8	Kios Elogia Tani	Pemilik 3	Desa Jatiroyom	087711881125	2025-10-19 14:46:51.62	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760885209/lyuaudh6fold0czdunu1.png
82e633bd-d72c-4ab7-bb10-b398aaa22d12	Kios Tani Jaya	Pemilik 4	Desa Pasir	082329146008	2025-10-19 14:47:48.517	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760885262/xmxqqi5l63h9nlmy8rui.png
31d0273f-d263-4095-b219-3f506bcf64bd	Kios Barokah Tani	Pemilik 5	Desa Kesesirejo	085713055722	2025-10-19 14:48:44.804	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760885321/iq0rlhdv1sizxznseq4x.png
6a00f9dd-eb9d-43cf-9b83-435dca57d793	Kios Akbar Galih Tani	Pemilik 6	Desa Parunggalih	085225153537	2025-10-19 14:49:41.415	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760885377/hss4xiptyxw3odubvxyp.png
c39fc564-ac08-4ae8-9980-8e621e4def90	Kios Bolo Tani	Pemilik 7	Desa Karangbrai	0816402999	2025-10-19 14:50:31.425	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760885427/ryyxw7vvxxitbaahjt1c.png
b357f6fa-0b8d-4beb-a5c2-c02f4c3a7974	Kios Abdi Tani	Pemilik 8	Desa Babakan	081542177725	2025-10-19 14:52:10.304	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760885500/attuoczxdcjnpxfglrjf.png
3c823edf-ba50-4bf7-b64b-27b15d272d0a	Kios Tani Makmur	Pemilik 9	Desa Kesesirejo	087793618449	2025-10-19 14:52:56.497	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760885569/l7cjnberbfa3vlr9bxsf.png
4139a5eb-1ce2-44a2-9a5c-cf4b9142d66e	Kios Saraswati	Pemilik 10	Desa Kebandaran	085329987995	2025-10-19 14:53:47.733	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760885625/anxjmc3t2r6vv4tx5smd.png
6ce281ee-c330-4697-bd59-fc8c437a07be	Kios Lestari	Pemilik 11	Desa Muncang	081226887490	2025-10-19 14:54:31.214	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760885668/rv4mc40zoatw17tphqwe.png
700ac2ba-8d6f-4b3c-bf5e-31d80bbfcd5c	Kios Soleh Tani	Pemilik 12	Desa Pendowo	082223162446	2025-10-19 14:55:17.411	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760885713/onf7h7mgzzyekzhoify3.png
5141f39e-bb25-4fa2-8200-b48616768585	Kios Sukses Tani	Pemilik 13	Desa Jraganan	087830919427	2025-10-19 14:56:03.221	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760885760/htqxdaatdftksydqzqu5.png
\.


--
-- Data for Name: Materi; Type: TABLE DATA; Schema: public; Owner: balaiPenyuluhan
--

COPY public."Materi" (title, "fileName", "fileUrl", "uploadDate", "updateDate", "penyuluhId", id) FROM stdin;
Materi 7	file7.pdf	/files/file7.pdf	2025-10-11 15:22:32.115	2025-10-11 15:22:32.115	\N	94b269e8-e35c-4cf0-8c9f-c93bd7c04b4c
Materi 3	file3.pdf	/files/file3.pdf	2025-10-11 15:22:32.107	2025-10-11 15:22:32.107	\N	3dd7e3bd-f188-4ddd-9cca-b553b97dcbda
Materi 6	file6.pdf	/files/file6.pdf	2025-10-11 15:22:32.113	2025-10-11 15:22:32.113	\N	e3d46ad7-52c6-4bb2-afcb-1a2a77db7c4e
Materi 8	file8.pdf	/files/file8.pdf	2025-10-11 15:22:32.117	2025-10-11 15:22:32.117	\N	a5681674-7ee8-4ae9-a2dc-9c521560b3e4
Materi 10	file10.pdf	/files/file10.pdf	2025-10-11 15:22:32.122	2025-10-11 15:22:32.122	\N	49b4e7b3-235c-4bcc-8502-a26ac2da18dd
Materi 4	file4.pdf	/files/file4.pdf	2025-10-11 15:22:32.109	2025-10-11 15:22:32.109	\N	6351de58-f4cb-40f1-9ea2-9541d3b03fce
Materi 9	file9.pdf	/files/file9.pdf	2025-10-11 15:22:32.12	2025-10-11 15:22:32.12	\N	79dea899-d1a8-4a5c-b156-453b5b45775d
Materi 5	file5.pdf	/files/file5.pdf	2025-10-11 15:22:32.111	2025-10-11 15:22:32.111	\N	c5293b21-093f-4ec0-bf85-95f5bd810e30
Materi 1	file1.pdf	/files/file1.pdf	2025-10-11 15:22:32.101	2025-10-11 15:22:32.101	\N	d0304653-8681-48fd-9bbc-791fa151c83f
\.


--
-- Data for Name: Pengumuman; Type: TABLE DATA; Schema: public; Owner: balaiPenyuluhan
--

COPY public."Pengumuman" (id, title, description, date, "penyuluhId", "kelompokTaniId", "desaBinaanId") FROM stdin;
d2a103d9-efd0-4ba2-949a-f6efde8943d9	Pengumuman 4	Deskripsi pengumuman 4	2025-10-11 15:22:32.214	\N	\N	\N
f5ca1640-c574-4a75-a2c4-64c905c25132	Pengumuman 3	Deskripsi pengumuman 3	2025-10-11 15:22:32.209	\N	\N	\N
aaacb052-a3bc-4b89-a65e-0f7bdd93bf24	Pengumuman 6	Deskripsi pengumuman 6	2025-10-11 15:22:32.225	\N	\N	\N
1641d266-0fcf-4c03-a8b9-37e5b1f152d4	Pengumuman 8	Deskripsi pengumuman 8	2025-10-11 15:22:32.234	\N	\N	\N
77d4ef1d-7ae5-4126-8468-279886cd3ff6	Pengumuman 10	Deskripsi pengumuman 10	2025-10-11 15:22:32.247	\N	\N	\N
ac935a20-75e5-4f44-ae9c-9de2b2f07b65	Pengumuman 2	Deskripsi pengumuman 2	2025-10-11 15:22:32.2	\N	\N	\N
df502260-19d3-48e5-aa9e-53d550e32695	Pengumuman 9	Deskripsi pengumuman 9	2025-10-11 15:22:32.241	\N	\N	\N
399ad1a7-e4bd-4fb5-9724-e35705fdd715	Pengumuman 5	Deskripsi pengumuman 5	2025-10-11 15:22:32.219	\N	\N	\N
22a7a2e9-154f-464d-9836-bc763d76a8b1	Pengumuman 1	Deskripsi pengumuman 1	2025-10-11 15:22:32.183	\N	\N	\N
\.


--
-- Data for Name: Penyuluh; Type: TABLE DATA; Schema: public; Owner: balaiPenyuluhan
--

COPY public."Penyuluh" (id, username, name, email, phone, address, img, bidang, "createdAt", birthday, gender, surname) FROM stdin;
user_34ELhC6AxDAdzsL8cmSbB9fHXJQ	P-4-Rahayu_Umi	Rahayu Umi	Penyuluh4@gmail.com	085216479295	Kesesirejo	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760773885/qcgqo0nb1daoknnto9vr.jpg	{"Pelaksanan Penyuluh Terampil"}	2025-10-18 07:51:40.835	1988-04-18 00:00:00	WANITA	Suprihatin
user_34Ffoy7n3Gg7XGspJQVclJPTcv2	P-5-Igit_Ginanjar	Igit Ginanjar Pranowo	testing5@gmail.com	081328359547	Bodeh	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760814414/ruyyszzpavlnz5kmihkd.jpg	{"Penyuluh Pertanian Terampil"}	2025-10-18 19:06:58.572	1995-05-19 00:00:00	PRIA	, S.P.
user_349rcujFEPuERx5YoJ4Dfn9bsd0	P-1-Santoso_Dwi	Santoso Dwi Muharso	Penyuluh2@gmail.com	085225325871	Bodeh	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760636704/bjwo4we1hj9rah74pw9m.jpg	{"Penyuluh Ahli Muda"}	2025-10-16 17:45:10.493	1988-02-17 00:00:00	PRIA	,S.P.
user_349iBnPRZanZRY5C12Wyiv7wU84	P-2-Lukman_Mei	Lukman Mei Widitya	Penyuluh1@gmail.com	082243043224	Bodeh	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760632051/x5qwik1juw9vnyeti4se.jpg	{"Penyuluh Ahli Pertama"}	2025-10-16 16:27:35.454	1995-01-16 00:00:00	PRIA	,S.P.
e947c353-1892-431e-9674-aee6e10bb91c	P-3-Akhmad_Abadi	Akhmad Abadi	Penyuluh3@gmail.com	085725401467	Bodeh	https://res.cloudinary.com/dsvhmwydm/image/upload/v1760689151/ud5i6xnnxojoiwt4cjkk.jpg	{"Pelaksanan Penyuluh Terampil"}	2025-10-17 08:19:16.832	1995-03-16 00:00:00	PRIA	, A.Md.
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: balaiPenyuluhan
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
d17e4afc-c5a2-43a6-9dd2-87c73fff4300	c3152eae7788a2882981f3cf6a266030c30e15212148ebfe02376d0bd93c99c7	2025-10-11 15:22:28.088018+00	20250706153955_init	\N	\N	2025-10-11 15:22:28.069368+00	1
427e5d54-5622-4a75-bf33-80861f16d838	e93320882e555a6e568ad82174b52aae5cd6af8c2be85e6c717a785b9b75ff5f	2025-10-11 15:22:28.198092+00	20251004063010_add_username_kelompoktani_nullable	\N	\N	2025-10-11 15:22:28.193722+00	1
8d0a76cc-f491-4d98-a1b7-2994a68d47fe	6cb4fbe033df635f465e887508475a2526543f2335b76c5c48ea39bc432f11b7	2025-10-11 15:22:28.09653+00	20250709062235_add_kios_pengumuman	\N	\N	2025-10-11 15:22:28.089455+00	1
8a7104cf-2890-44a2-a22b-9c80c45889a9	d0988a012477dd271bd34c148c7f51c1ca79f6ff35272fba366122dd53d17213	2025-10-11 15:22:28.107864+00	20250716073350_bpp	\N	\N	2025-10-11 15:22:28.097984+00	1
fadab530-9d72-4b37-9ea1-e86dcbe32bcd	1892023cc4c4aa4e28dedfb1dfe716be74111f96160ffb43b64ffac73589a85c	2025-10-11 15:22:28.116278+00	20250716080634_change_materi_id_to_uuid	\N	\N	2025-10-11 15:22:28.109459+00	1
d9460244-7c8c-453d-820b-1a4a58976f70	877a87767475505a75fe1fcef19747bf30609692174f9888ed35f2e89d8942c5	2025-10-11 15:22:28.203618+00	20251004065219_make_username_required_unique_kelompoktani	\N	\N	2025-10-11 15:22:28.199458+00	1
00897162-432e-4071-a824-8bdf2b247c71	ce438a17ff60d20435cb2a8b2bb661193120cc505d4209823fa9db64fda50c69	2025-10-11 15:22:28.125096+00	20250716081059_change_kegiatan_id_to_uuid	\N	\N	2025-10-11 15:22:28.117655+00	1
0d39c96b-d215-4e77-831e-87a2cd003b95	7912b8839525658e8cbbb3ae73fdfaa32db0cb6e4e4a21b270a87fbcfc489d0e	2025-10-11 15:22:28.131553+00	20250716081355_add_unique_to_kegiatan_title	\N	\N	2025-10-11 15:22:28.127076+00	1
31785493-08f7-4580-b37b-9da39a1d0324	5c327ce8853d76b0f76066402571549d97961767a33609c8f4c3e0b2c1303e36	2025-10-11 15:22:28.139398+00	20250716081556_change_kegiatan_id_to_int	\N	\N	2025-10-11 15:22:28.13292+00	1
68d4d35c-9e0a-40e2-8e32-c85371141e35	152a9837dcaa6933d8f5e395b04b41dac4005465cd49b33ad7a2c51dc1ff5fd4	2025-10-11 15:22:28.210796+00	20251005140545_add_img_to_kiospertanian	\N	\N	2025-10-11 15:22:28.205243+00	1
50a55201-580c-424f-96e4-10513049fb25	de036d1698ee9f87f5f4efc457b8a30036363d4dcee15d7e1a8c4fbc98994967	2025-10-11 15:22:28.147893+00	20250716081751_change_kegiatan_id_to_uuid	\N	\N	2025-10-11 15:22:28.140968+00	1
15799ede-53ee-4f1e-915b-853227079c61	dd0d9d868ccf79d6630619b340775e072092412185e44791bb7e69b6504e2c36	2025-10-11 15:22:28.164952+00	20250716090916_change_to_string	\N	\N	2025-10-11 15:22:28.149303+00	1
2dca5beb-2d59-4912-b57c-538565526ce5	b6b18fd1b616e0adb93a83790123f7a382040ecc37dda62c6bdc18fd36e40828	2025-10-11 15:22:28.171019+00	20250728170809_add_desa_binaan_id_to_pengumuman	\N	\N	2025-10-11 15:22:28.166255+00	1
8c1118f0-51e2-44fe-9b17-7f1554e7a9eb	399b864bb25195890408e8abfb7aadc328211fda5ece61acff06ad5adc778b81	2025-10-11 15:22:28.217141+00	20251005171555_update_kiospengumuman_relation	\N	\N	2025-10-11 15:22:28.212319+00	1
2ba0c143-8333-4965-b287-10968b485401	6793078495416b4ca2b8f1c9e7214e0d549aa0ce2518322a0192fb5926273a8f	2025-10-11 15:22:28.177804+00	20250910065639_add_surname_gender_birthday	\N	\N	2025-10-11 15:22:28.172832+00	1
09d1c283-e593-4f95-bd09-6ab285775e3f	f45a236a93ae29d9eae0d83ee60b669ce40c7e4b9ffef4665752265270560062	2025-10-11 15:22:28.184102+00	20250915145536_make_penyuluh_optional	\N	\N	2025-10-11 15:22:28.179161+00	1
e69e76bf-41ab-425e-96bc-fb9f6eff590a	04fecb143b6834b14307024d207e130f8f87f2c24f8f6c3f5e1b6a455d844815	2025-10-11 15:22:28.19234+00	20250916162322_set_penyuluh_ondelete_setnull	\N	\N	2025-10-11 15:22:28.185533+00	1
62aa869d-cb46-4bdd-8c00-66670bd4db23	fd3046a6222d68cddb1b368b20f62f5e3ec1a82e42b37a3af538717cf7977603	2025-10-11 15:22:28.223755+00	20251006065526_make_desa_binaan_id_optional	\N	\N	2025-10-11 15:22:28.218553+00	1
e3d3b220-c8fa-4bea-84c7-bfd0eb870a92	b689e91a9f3794fd4fe316e6d0fe0cb220d957457394900569e36c40770f9ec2	2025-10-11 15:22:28.231586+00	20251009161757_update_ondelete_setnull	\N	\N	2025-10-11 15:22:28.225663+00	1
0ba41407-84af-4b95-be2d-b48c50d50ccf	242ef33695a447cd903c0d8186068dea9ed4ad585c9f334d7b62274c2a304b83	2025-10-11 15:22:28.238034+00	20251011151434_add_luas_area_optional	\N	\N	2025-10-11 15:22:28.232991+00	1
ad899a5c-bca6-494d-8bd3-0717aba5425d	2a97e7aac40ab434790f6969d4bafcec9215a0a291b9ca7d1d49e488509de462	2025-10-12 13:40:19.219103+00	20251012134019_cascade_delete_pengumuman	\N	\N	2025-10-12 13:40:19.203898+00	1
\.


--
-- Name: Admin Admin_pkey; Type: CONSTRAINT; Schema: public; Owner: balaiPenyuluhan
--

ALTER TABLE ONLY public."Admin"
    ADD CONSTRAINT "Admin_pkey" PRIMARY KEY (id);


--
-- Name: DesaBinaan DesaBinaan_pkey; Type: CONSTRAINT; Schema: public; Owner: balaiPenyuluhan
--

ALTER TABLE ONLY public."DesaBinaan"
    ADD CONSTRAINT "DesaBinaan_pkey" PRIMARY KEY (id);


--
-- Name: DokumentasiAcara DokumentasiAcara_pkey; Type: CONSTRAINT; Schema: public; Owner: balaiPenyuluhan
--

ALTER TABLE ONLY public."DokumentasiAcara"
    ADD CONSTRAINT "DokumentasiAcara_pkey" PRIMARY KEY (id);


--
-- Name: Kegiatan Kegiatan_pkey; Type: CONSTRAINT; Schema: public; Owner: balaiPenyuluhan
--

ALTER TABLE ONLY public."Kegiatan"
    ADD CONSTRAINT "Kegiatan_pkey" PRIMARY KEY (id);


--
-- Name: KelompokTani KelompokTani_pkey; Type: CONSTRAINT; Schema: public; Owner: balaiPenyuluhan
--

ALTER TABLE ONLY public."KelompokTani"
    ADD CONSTRAINT "KelompokTani_pkey" PRIMARY KEY (id);


--
-- Name: KiosPengumuman KiosPengumuman_pkey; Type: CONSTRAINT; Schema: public; Owner: balaiPenyuluhan
--

ALTER TABLE ONLY public."KiosPengumuman"
    ADD CONSTRAINT "KiosPengumuman_pkey" PRIMARY KEY (id);


--
-- Name: KiosPertanian KiosPertanian_pkey; Type: CONSTRAINT; Schema: public; Owner: balaiPenyuluhan
--

ALTER TABLE ONLY public."KiosPertanian"
    ADD CONSTRAINT "KiosPertanian_pkey" PRIMARY KEY (id);


--
-- Name: Materi Materi_pkey; Type: CONSTRAINT; Schema: public; Owner: balaiPenyuluhan
--

ALTER TABLE ONLY public."Materi"
    ADD CONSTRAINT "Materi_pkey" PRIMARY KEY (id);


--
-- Name: Pengumuman Pengumuman_pkey; Type: CONSTRAINT; Schema: public; Owner: balaiPenyuluhan
--

ALTER TABLE ONLY public."Pengumuman"
    ADD CONSTRAINT "Pengumuman_pkey" PRIMARY KEY (id);


--
-- Name: Penyuluh Penyuluh_pkey; Type: CONSTRAINT; Schema: public; Owner: balaiPenyuluhan
--

ALTER TABLE ONLY public."Penyuluh"
    ADD CONSTRAINT "Penyuluh_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: balaiPenyuluhan
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Admin_email_key; Type: INDEX; Schema: public; Owner: balaiPenyuluhan
--

CREATE UNIQUE INDEX "Admin_email_key" ON public."Admin" USING btree (email);


--
-- Name: Admin_username_key; Type: INDEX; Schema: public; Owner: balaiPenyuluhan
--

CREATE UNIQUE INDEX "Admin_username_key" ON public."Admin" USING btree (username);


--
-- Name: Kegiatan_title_key; Type: INDEX; Schema: public; Owner: balaiPenyuluhan
--

CREATE UNIQUE INDEX "Kegiatan_title_key" ON public."Kegiatan" USING btree (title);


--
-- Name: KelompokTani_phone_key; Type: INDEX; Schema: public; Owner: balaiPenyuluhan
--

CREATE UNIQUE INDEX "KelompokTani_phone_key" ON public."KelompokTani" USING btree (phone);


--
-- Name: KiosPengumuman_kiosPertanianId_pengumumanId_key; Type: INDEX; Schema: public; Owner: balaiPenyuluhan
--

CREATE UNIQUE INDEX "KiosPengumuman_kiosPertanianId_pengumumanId_key" ON public."KiosPengumuman" USING btree ("kiosPertanianId", "pengumumanId");


--
-- Name: KiosPertanian_phone_key; Type: INDEX; Schema: public; Owner: balaiPenyuluhan
--

CREATE UNIQUE INDEX "KiosPertanian_phone_key" ON public."KiosPertanian" USING btree (phone);


--
-- Name: Penyuluh_email_key; Type: INDEX; Schema: public; Owner: balaiPenyuluhan
--

CREATE UNIQUE INDEX "Penyuluh_email_key" ON public."Penyuluh" USING btree (email);


--
-- Name: Penyuluh_phone_key; Type: INDEX; Schema: public; Owner: balaiPenyuluhan
--

CREATE UNIQUE INDEX "Penyuluh_phone_key" ON public."Penyuluh" USING btree (phone);


--
-- Name: Penyuluh_username_key; Type: INDEX; Schema: public; Owner: balaiPenyuluhan
--

CREATE UNIQUE INDEX "Penyuluh_username_key" ON public."Penyuluh" USING btree (username);


--
-- Name: DesaBinaan DesaBinaan_penyuluhId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: balaiPenyuluhan
--

ALTER TABLE ONLY public."DesaBinaan"
    ADD CONSTRAINT "DesaBinaan_penyuluhId_fkey" FOREIGN KEY ("penyuluhId") REFERENCES public."Penyuluh"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: DokumentasiAcara DokumentasiAcara_penyuluhId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: balaiPenyuluhan
--

ALTER TABLE ONLY public."DokumentasiAcara"
    ADD CONSTRAINT "DokumentasiAcara_penyuluhId_fkey" FOREIGN KEY ("penyuluhId") REFERENCES public."Penyuluh"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Kegiatan Kegiatan_penyuluhId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: balaiPenyuluhan
--

ALTER TABLE ONLY public."Kegiatan"
    ADD CONSTRAINT "Kegiatan_penyuluhId_fkey" FOREIGN KEY ("penyuluhId") REFERENCES public."Penyuluh"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: KelompokTani KelompokTani_desaBinaanId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: balaiPenyuluhan
--

ALTER TABLE ONLY public."KelompokTani"
    ADD CONSTRAINT "KelompokTani_desaBinaanId_fkey" FOREIGN KEY ("desaBinaanId") REFERENCES public."DesaBinaan"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: KiosPengumuman KiosPengumuman_kiosPertanianId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: balaiPenyuluhan
--

ALTER TABLE ONLY public."KiosPengumuman"
    ADD CONSTRAINT "KiosPengumuman_kiosPertanianId_fkey" FOREIGN KEY ("kiosPertanianId") REFERENCES public."KiosPertanian"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: KiosPengumuman KiosPengumuman_pengumumanId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: balaiPenyuluhan
--

ALTER TABLE ONLY public."KiosPengumuman"
    ADD CONSTRAINT "KiosPengumuman_pengumumanId_fkey" FOREIGN KEY ("pengumumanId") REFERENCES public."Pengumuman"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Materi Materi_penyuluhId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: balaiPenyuluhan
--

ALTER TABLE ONLY public."Materi"
    ADD CONSTRAINT "Materi_penyuluhId_fkey" FOREIGN KEY ("penyuluhId") REFERENCES public."Penyuluh"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Pengumuman Pengumuman_desaBinaanId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: balaiPenyuluhan
--

ALTER TABLE ONLY public."Pengumuman"
    ADD CONSTRAINT "Pengumuman_desaBinaanId_fkey" FOREIGN KEY ("desaBinaanId") REFERENCES public."DesaBinaan"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Pengumuman Pengumuman_kelompokTaniId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: balaiPenyuluhan
--

ALTER TABLE ONLY public."Pengumuman"
    ADD CONSTRAINT "Pengumuman_kelompokTaniId_fkey" FOREIGN KEY ("kelompokTaniId") REFERENCES public."KelompokTani"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Pengumuman Pengumuman_penyuluhId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: balaiPenyuluhan
--

ALTER TABLE ONLY public."Pengumuman"
    ADD CONSTRAINT "Pengumuman_penyuluhId_fkey" FOREIGN KEY ("penyuluhId") REFERENCES public."Penyuluh"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: balaiPenyuluhan
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

