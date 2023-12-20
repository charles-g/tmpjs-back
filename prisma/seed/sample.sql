SET session_replication_role = 'replica';

-- Tronquer les tables (supprimer toutes les données et réinitialiser les auto-incréments)
TRUNCATE TABLE "WorkerSkill" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "CompanySkill" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "PostContractFeedback" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "WorkerApplication" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "ApplicationStatus" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "CompanyAddress" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "CompanyAvailableContractTimeSlot" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "WorkerAvailability" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "Skill" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "WorkerAddress" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "CompanyAddress" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "Company" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "Worker" RESTART IDENTITY CASCADE;

-- Réactiver les contraintes de clé étrangère
SET session_replication_role = 'origin';

-- Insérer des données d'exemple dans la table "Worker"
INSERT INTO "Worker" ("first_name", "last_name", "email", "phone")
VALUES
  ('Jean', 'Dupont', 'jean.dupont@example.com', '01 23 45 67 89'),
  ('Marie', 'Lefevre', 'marie.lefevre@example.com', '06 12 34 56 78'),
  ('Pierre', 'Martin', 'pierre.martin@example.com', '07 89 12 34 56'),
  ('Sophie', 'Leroux', 'sophie.leroux@example.com', '02 34 56 78 90'),
  ('Luc', 'Dubois', 'luc.dubois@example.com', '09 87 65 43 21');

-- Insérer des données d'exemple dans la table "WorkerAddress"
INSERT INTO "WorkerAddress" ("worker_id", "street", "city", "zip", "country", "coordinates_lat", "coordinates_lon")
VALUES
  (1, '24 Rue Ambroise Croizat', 'Corbeil-Essonnes', '91000', 'France', '48.6240', '2.4090'),
  (2, '15 Avenue des Champs-Élysées', 'Paris', '75008', 'France', '48.8694', '2.3073'),
  (3, '5 Rue du Faubourg Saint-Antoine', 'Paris', '75011', 'France', '48.8530', '2.3700'),
  (4, '10 Avenue des Ternes', 'Paris', '75017', 'France', '48.8788', '2.2950'),
  (5, '20 Rue de la République', 'Saint-Denis', '93200', 'France', '48.9355', '2.3574');

-- Insérer des données d'exemple dans la table "Company"
INSERT INTO "Company" ("name")
VALUES
  ('Tech Co.'),
  ('Service Ltd.'),
  ('Consulting SARL');

-- Insérer des données d'exemple dans la table "WorkerAvailability"
INSERT INTO "WorkerAvailability" ("worker_id", "day_date")
VALUES
  (1, '2024-01-06'::TIMESTAMP),
  (1, '2024-01-09'::TIMESTAMP),
  (2, '2024-01-07'::TIMESTAMP),
  (2, '2024-01-08'::TIMESTAMP),
  (3, '2024-01-08'::TIMESTAMP),
  (4, '2024-01-06'::TIMESTAMP),
  (4, '2024-01-10'::TIMESTAMP),
  (5, '2024-01-07'::TIMESTAMP),
  (5, '2024-01-11'::TIMESTAMP)
;

-- Insérer des données d'exemple dans la table "CompanyAvailableContractTimeSlot"
INSERT INTO "CompanyAvailableContractTimeSlot" ("company_id", "day_date")
VALUES
  (1, '2024-01-06'::TIMESTAMP),
  (1, '2024-01-07'::TIMESTAMP),
  (2, '2024-01-07'::TIMESTAMP),
  (2, '2024-01-09'::TIMESTAMP),
  (3, '2024-01-06'::TIMESTAMP),
  (3, '2024-01-08'::TIMESTAMP),
  ;

-- Insérer des données d'exemple dans la table "CompanyAddress"
INSERT INTO "CompanyAddress" ("company_id", "street", "city", "zip", "country", "coordinates_lat", "coordinates_lon")
VALUES
  (1, '16 Rue de Bièvres', 'Clamart', '92140', 'France', '48.7996', '2.2634'),
  (2, '27 Bd Jean Jaurès', 'Boulogne-Billancourt', '92100', 'France', '48.8416', '2.2301'),
  (3, '2 All. du Marché', 'Melun', '77288', 'France', '48.5388', '2.6342');

-- Insérer des données d'exemple dans la table "Skill"
INSERT INTO "Skill" ("name")
VALUES
  ('Programmation'),
  ('Service Client'),
  ('Consultation'),
  ('Gestion de Projet'),
  ('Design Graphique');

-- Insérer des données d'exemple dans la table "WorkerSkill"
INSERT INTO "WorkerSkill" ("worker_id", "skill_id")
VALUES
  (1, 1),
  (1, 3),
  (2, 2),
  (3, 4),
  (4, 5),
  (5, 1),
  (5, 2);

-- Insérer des données d'exemple dans la table "CompanySkill"
INSERT INTO "CompanySkill" ("company_id", "skill_id")
VALUES
  (1, 1),
  (2, 2),
  (3, 3),
  (1, 4),
  (2, 5);

-- Insérer des données d'exemple dans la table "PostContractFeedback"
INSERT INTO "PostContractFeedback" ("company_id", "worker_id", "worker_feedback_positive", "company_feedback_positive")
VALUES
  (1, 1, true, true),
  (2, 2, false, true),
  (3, 3, true, false),
  (1, 4, false, true),
  (2, 5, true, true);

-- Insérer des données d'exemple dans la table "ApplicationStatus"
INSERT INTO "ApplicationStatus" ("label")
VALUES
  ('ACCEPTED'),
  ('REJECTED'),
  ('CANCELED'),
  ('EXPIRED');

-- Insérer des données d'exemple dans la table "WorkerApplication"
INSERT INTO "WorkerApplication" ("company_id", "worker_id", "status_id")
VALUES
  (1, 1, 1),
  (2, 2, 2),
  (3, 3, 3),
  (1, 4, 1),
  (2, 5, 2);
