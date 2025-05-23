PGDMP                        }            crypto_insignia_db    17.2    17.2                 0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false                       1262    16558    crypto_insignia_db    DATABASE     �   CREATE DATABASE crypto_insignia_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
 "   DROP DATABASE crypto_insignia_db;
                     postgres    false            �            1259    16559    SequelizeMeta    TABLE     R   CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);
 #   DROP TABLE public."SequelizeMeta";
       public         heap r       postgres    false            �            1259    16588    Transactions    TABLE     x  CREATE TABLE public."Transactions" (
    id integer NOT NULL,
    "senderId" integer NOT NULL,
    "recipientId" integer NOT NULL,
    amount double precision NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "senderName" character varying(255) NOT NULL,
    "recipientName" character varying(255) NOT NULL
);
 "   DROP TABLE public."Transactions";
       public         heap r       postgres    false            �            1259    16587    Transactions_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Transactions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public."Transactions_id_seq";
       public               postgres    false    223                       0    0    Transactions_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public."Transactions_id_seq" OWNED BY public."Transactions".id;
          public               postgres    false    222            �            1259    16565    Users    TABLE     �   CREATE TABLE public."Users" (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Users";
       public         heap r       postgres    false            �            1259    16564    Users_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public."Users_id_seq";
       public               postgres    false    219                       0    0    Users_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;
          public               postgres    false    218            �            1259    16576    Wallets    TABLE     �   CREATE TABLE public."Wallets" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    amount integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Wallets";
       public         heap r       postgres    false            �            1259    16575    Wallets_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Wallets_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public."Wallets_id_seq";
       public               postgres    false    221                       0    0    Wallets_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."Wallets_id_seq" OWNED BY public."Wallets".id;
          public               postgres    false    220            g           2604    16591    Transactions id    DEFAULT     v   ALTER TABLE ONLY public."Transactions" ALTER COLUMN id SET DEFAULT nextval('public."Transactions_id_seq"'::regclass);
 @   ALTER TABLE public."Transactions" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    223    222    223            e           2604    16568    Users id    DEFAULT     h   ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);
 9   ALTER TABLE public."Users" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    218    219    219            f           2604    16579 
   Wallets id    DEFAULT     l   ALTER TABLE ONLY public."Wallets" ALTER COLUMN id SET DEFAULT nextval('public."Wallets_id_seq"'::regclass);
 ;   ALTER TABLE public."Wallets" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    221    220    221                      0    16559    SequelizeMeta 
   TABLE DATA           /   COPY public."SequelizeMeta" (name) FROM stdin;
    public               postgres    false    217   �%                 0    16588    Transactions 
   TABLE DATA           �   COPY public."Transactions" (id, "senderId", "recipientId", amount, "createdAt", "updatedAt", "senderName", "recipientName") FROM stdin;
    public               postgres    false    223   N&                 0    16565    Users 
   TABLE DATA           S   COPY public."Users" (id, username, password, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    219   �'       
          0    16576    Wallets 
   TABLE DATA           S   COPY public."Wallets" (id, "userId", amount, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    221   �(                  0    0    Transactions_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public."Transactions_id_seq"', 19, true);
          public               postgres    false    222                       0    0    Users_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public."Users_id_seq"', 6, true);
          public               postgres    false    218                       0    0    Wallets_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public."Wallets_id_seq"', 3, true);
          public               postgres    false    220            i           2606    16563     SequelizeMeta SequelizeMeta_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);
 N   ALTER TABLE ONLY public."SequelizeMeta" DROP CONSTRAINT "SequelizeMeta_pkey";
       public                 postgres    false    217            q           2606    16593    Transactions Transactions_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public."Transactions"
    ADD CONSTRAINT "Transactions_pkey" PRIMARY KEY (id);
 L   ALTER TABLE ONLY public."Transactions" DROP CONSTRAINT "Transactions_pkey";
       public                 postgres    false    223            k           2606    16572    Users Users_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_pkey";
       public                 postgres    false    219            m           2606    16574    Users Users_username_key 
   CONSTRAINT     [   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key" UNIQUE (username);
 F   ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_username_key";
       public                 postgres    false    219            o           2606    16581    Wallets Wallets_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."Wallets"
    ADD CONSTRAINT "Wallets_pkey" PRIMARY KEY (id);
 B   ALTER TABLE ONLY public."Wallets" DROP CONSTRAINT "Wallets_pkey";
       public                 postgres    false    221            s           2606    16599 *   Transactions Transactions_recipientId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Transactions"
    ADD CONSTRAINT "Transactions_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES public."Users"(id) ON DELETE CASCADE;
 X   ALTER TABLE ONLY public."Transactions" DROP CONSTRAINT "Transactions_recipientId_fkey";
       public               postgres    false    219    223    4715            t           2606    16594 '   Transactions Transactions_senderId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Transactions"
    ADD CONSTRAINT "Transactions_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."Users"(id) ON DELETE CASCADE;
 U   ALTER TABLE ONLY public."Transactions" DROP CONSTRAINT "Transactions_senderId_fkey";
       public               postgres    false    223    4715    219            r           2606    16582    Wallets Wallets_userId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Wallets"
    ADD CONSTRAINT "Wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON DELETE CASCADE;
 I   ALTER TABLE ONLY public."Wallets" DROP CONSTRAINT "Wallets_userId_fkey";
       public               postgres    false    221    219    4715               j   x�M�1
�0@��wQ�D�]�[�K�I��/Z<���"a#��UR���=
/Z����<5g<�����Bz��ֈꎴ���6�����TK0yh@^�����R>b"1�         X  x�}�;n�0�V������Z�DJ�&]���ؗP!]͑�#�,�/��,Oчj�
S���������C��xsSY�V9VS��#9D��{��=`�!���p��C�Z����J���Ȱ�RGҽ�D%�L^"t�xC��L%@�"���b�REd�o����Do�W�ȲĽqsU'.`>����u��'�3�1�u	$e�F4��V�(k��+̽u��4վ����6]JQt� �]�ֽ�����Z�]%��Q�hإ�_��ZH�@��Lj2.P=#��]fK�r���}�t�s�91H�$���Q�TN��z���˱�����D��	2�i]�_��H�         �   x�}��O�0��3�+8�fh�_;Fwc�mNpHtn��I;İ�^6�zI�!�\��O�S�b�R`�g@jPb�Y���x:�6;J�e�i={-)^5ƫ��"Y�۹�v���`����9 t@�`��f3K\럄���虯�\�!^%���Z*��6�0q̴ �q#��@�]i��yYuip�?�_�O;�7��Poy����7���3��L25��Sr���:/�n3M�`Rx��1x��`� �/�"�g�� �Ia�      
   g   x�u�1A��ۣ�b'���[��;�DQ�g�)@a	�u8�@v�&,�y�T��yv����X��p�]�H�]����Jf�ڹ�'��ׯ��Vѻ��F�"�     