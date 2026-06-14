import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id            CHAR(36)     NOT NULL DEFAULT (UUID()),
        email         VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS posts (
        id           CHAR(36)     NOT NULL DEFAULT (UUID()),
        title        VARCHAR(500) NOT NULL,
        slug         VARCHAR(500) NOT NULL UNIQUE,
        excerpt      TEXT,
        content      LONGTEXT,
        cover_image  VARCHAR(1000),
        type         VARCHAR(50)  NOT NULL DEFAULT 'article',
        tags         JSON,
        published    TINYINT(1)   NOT NULL DEFAULT 0,
        featured     TINYINT(1)   NOT NULL DEFAULT 0,
        view_count   INT          NOT NULL DEFAULT 0,
        published_at DATETIME,
        created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS events (
        id                CHAR(36)     NOT NULL DEFAULT (UUID()),
        title             VARCHAR(500) NOT NULL,
        description       LONGTEXT,
        location          VARCHAR(500),
        event_date        DATETIME,
        end_date          DATETIME,
        type              VARCHAR(50)  NOT NULL DEFAULT 'event',
        status            VARCHAR(50)  NOT NULL DEFAULT 'upcoming',
        max_participants  INT,
        is_online         TINYINT(1)   NOT NULL DEFAULT 0,
        registration_url  VARCHAR(1000),
        cover_image       VARCHAR(1000),
        tags              JSON,
        created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS surveys (
        id          CHAR(36)     NOT NULL DEFAULT (UUID()),
        title       VARCHAR(500) NOT NULL,
        description TEXT,
        questions   JSON,
        is_active   TINYINT(1)   NOT NULL DEFAULT 1,
        ends_at     DATETIME,
        created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS survey_responses (
        id          CHAR(36)     NOT NULL DEFAULT (UUID()),
        survey_id   CHAR(36)     NOT NULL,
        answers     JSON,
        created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS messages (
        id         CHAR(36)     NOT NULL DEFAULT (UUID()),
        name       VARCHAR(255) NOT NULL,
        email      VARCHAR(255) NOT NULL,
        subject    VARCHAR(500),
        message    LONGTEXT     NOT NULL,
        is_read    TINYINT(1)   NOT NULL DEFAULT 0,
        created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id           CHAR(36)     NOT NULL DEFAULT (UUID()),
        email        VARCHAR(255) NOT NULL UNIQUE,
        is_active    TINYINT(1)   NOT NULL DEFAULT 1,
        subscribed_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS about_info (
        id            CHAR(36)     NOT NULL DEFAULT (UUID()),
        full_name     VARCHAR(255) NOT NULL,
        title         VARCHAR(255),
        organization  VARCHAR(255),
        bio           LONGTEXT,
        skills        JSON,
        social_links  JSON,
        profile_image VARCHAR(1000),
        updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS downloads (
        id             CHAR(36)     NOT NULL DEFAULT (UUID()),
        title          VARCHAR(500) NOT NULL,
        description    TEXT,
        filename       VARCHAR(500) NOT NULL,
        original_name  VARCHAR(500) NOT NULL,
        file_size      BIGINT       NOT NULL DEFAULT 0,
        file_type      VARCHAR(100),
        download_count INT          NOT NULL DEFAULT 0,
        created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    return NextResponse.json({ ok: true, message: "Tüm tablolar oluşturuldu." });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
  }
}
