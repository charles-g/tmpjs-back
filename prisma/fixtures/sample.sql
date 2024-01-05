-- Set replication role to replica for truncating tables
SET session_replication_role = 'replica';

-- Truncate tables and restart identity sequences
TRUNCATE TABLE "WorkerSkill" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "CompanySkill" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "ContractPosition" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "PostContractFeedback" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "WorkerApplication" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "ApplicationStatus" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "CompanyAddress" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "CompanyAvailableContractTimeSlot" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "WorkerAvailability" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "Skill" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "WorkerAddress" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "Company" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "Worker" RESTART IDENTITY CASCADE;

-- Reactivate foreign key constraints
SET session_replication_role = 'origin';

-- Insert example data into the "Worker" table
INSERT INTO "Worker" ("first_name", "last_name", "email", "phone")
VALUES
  ('Jean', 'Dupont', 'jean.dupont@example.com', '01 23 45 67 89'),
  ('Marie', 'Lefevre', 'marie.lefevre@example.com', '06 12 34 56 78'),
  ('Pierre', 'Martin', 'pierre.martin@example.com', '07 89 12 34 56'),
  ('Sophie', 'Leroux', 'sophie.leroux@example.com', '02 34 56 78 90'),
  ('Luc', 'Dubois', 'luc.dubois@example.com', '09 87 65 43 21'),
  ('Isabelle', 'Moreau', 'isabelle.moreau@example.com', '01 45 67 89 10'),
  ('Thomas', 'Girard', 'thomas.girard@example.com', '06 23 45 67 89'),
  ('Laura', 'Dubois', 'laura.dubois@example.com', '07 89 23 45 67'),
  ('Nicolas', 'Lefevre', 'nicolas.lefevre@example.com', '02 34 56 78 90'),
  ('Sophie', 'Martin', 'sophie.martin@example.com', '09 87 65 43 21'),
  ('Pierre', 'Leroux', 'pierre.leroux@example.com', '01 98 76 54 32'),
  ('Céline', 'Dumont', 'celine.dumont@example.com', '06 12 34 56 78'),
  ('Antoine', 'Dupuis', 'antoine.dupuis@example.com', '07 89 12 34 56'),
  ('Manon', 'Garcia', 'manon.garcia@example.com', '02 23 45 67 89'),
  ('Julien', 'Lemoine', 'julien.lemoine@example.com', '09 87 65 43 21');

-- Insert example data into the "WorkerAddress" table
INSERT INTO "WorkerAddress" ("worker_id", "street", "city", "zip", "country", "coordinates_lat", "coordinates_lon")
VALUES
  (1, '24 Rue Ambroise Croizat', 'Corbeil-Essonnes', '91000', 'France', '48.6240', '2.4090'),
  (2, '15 Avenue des Champs-Élysées', 'Paris', '75008', 'France', '48.8694', '2.3073'),
  (3, '5 Rue du Faubourg Saint-Antoine', 'Paris', '75011', 'France', '48.8530', '2.3700'),
  (4, '10 Avenue des Ternes', 'Paris', '75017', 'France', '48.8788', '2.2950'),
  (5, '20 Rue de la République', 'Saint-Denis', '93200', 'France', '48.9355', '2.3574'),
  (6, '8 Avenue Montaigne', 'Paris', '75008', 'France', '48.8697', '2.3095'),
  (7, '3 Rue de la Pompe', 'Neuilly-sur-Seine', '92200', 'France', '48.8818', '2.2693'),
  (8, '45 Quai des Orfèvres', 'Paris', '75001', 'France', '48.8576', '2.3466'),
  (9, '12 Avenue des Gobelins', 'Paris', '75013', 'France', '48.8338', '2.3529'),
  (10, '6 Rue de la République', 'Levallois-Perret', '92300', 'France', '48.8960', '2.2903'),
  (11, '18 Avenue de la Grande Armée', 'Paris', '75116', 'France', '48.8747', '2.2891'),
  (12, '10 Rue de Sèvres', 'Boulogne-Billancourt', '92100', 'France', '48.8337', '2.2363'),
  (13, '7 Rue de la Paix', 'Paris', '75002', 'France', '48.8689', '2.3315'),
  (14, '22 Boulevard Haussmann', 'Paris', '75009', 'France', '48.8723', '2.3340'),
  (15, '14 Avenue Foch', 'Paris', '75116', 'France', '48.8706', '2.2833');

-- Insert example data into the "Company" table
INSERT INTO "Company" ("name")
VALUES
  ('Tech Co.'),
  ('Service Ltd.'),
  ('Consulting SARL'),
  ('Tech Solutions SAS'),
  ('Innovation Group'),
  ('Digital Services SA'),
  ('Creative Minds SARL'),
  ('Engineering Experts SAS'),
  ('IT Masters Ltd.'),
  ('Business Innovators SA'),
  ('Tech Wizards SARL'),
  ('Smart Solutions SAS'),
  ('Future Tech Ltd.');

-- Insert example data into the "WorkerAvailability" table
INSERT INTO "WorkerAvailability" ("worker_id", "day_date")
VALUES
  (1, '2024-01-11'::TIMESTAMP),
  (1, '2024-01-14'::TIMESTAMP),
  (1, '2024-01-17'::TIMESTAMP),
  (2, '2024-01-12'::TIMESTAMP),
  (2, '2024-01-13'::TIMESTAMP),
  (2, '2024-01-16'::TIMESTAMP),
  (3, '2024-01-13'::TIMESTAMP),
  (3, '2024-01-15'::TIMESTAMP),
  (3, '2024-01-18'::TIMESTAMP),
  (4, '2024-01-11'::TIMESTAMP),
  (4, '2024-01-14'::TIMESTAMP),
  (4, '2024-01-17'::TIMESTAMP),
  (5, '2024-01-12'::TIMESTAMP),
  (5, '2024-01-13'::TIMESTAMP),
  (5, '2024-01-16'::TIMESTAMP),
  (6, '2024-01-11'::TIMESTAMP),
  (6, '2024-01-14'::TIMESTAMP),
  (6, '2024-01-17'::TIMESTAMP),
  (7, '2024-01-12'::TIMESTAMP),
  (7, '2024-01-15'::TIMESTAMP),
  (7, '2024-01-18'::TIMESTAMP),
  (8, '2024-01-13'::TIMESTAMP),
  (8, '2024-01-16'::TIMESTAMP),
  (8, '2024-01-19'::TIMESTAMP),
  (9, '2024-01-11'::TIMESTAMP),
  (9, '2024-01-14'::TIMESTAMP),
  (9, '2024-01-17'::TIMESTAMP),
  (10, '2024-01-12'::TIMESTAMP),
  (10, '2024-01-13'::TIMESTAMP),
  (10, '2024-01-16'::TIMESTAMP),
  (11, '2024-01-11'::TIMESTAMP),
  (11, '2024-01-14'::TIMESTAMP),
  (11, '2024-01-17'::TIMESTAMP),
  (12, '2024-01-12'::TIMESTAMP),
  (12, '2024-01-15'::TIMESTAMP),
  (12, '2024-01-18'::TIMESTAMP),
  (13, '2024-01-13'::TIMESTAMP),
  (13, '2024-01-16'::TIMESTAMP),
  (13, '2024-01-19'::TIMESTAMP),
  (14, '2024-01-11'::TIMESTAMP),
  (14, '2024-01-14'::TIMESTAMP),
  (14, '2024-01-17'::TIMESTAMP),
  (15, '2024-01-12'::TIMESTAMP),
  (15, '2024-01-13'::TIMESTAMP),
  (15, '2024-01-16'::TIMESTAMP);

INSERT INTO "ContractPosition" ("name")
VALUES
  ('Gestionnaire'),
  ('Coordinateur'),
  ('Assistant');

-- Insert example data into the "CompanyAvailableContractTimeSlot" table
-- Insert example data into the "CompanyAvailableContractTimeSlot" table with specified ContractPosition ids
INSERT INTO "CompanyAvailableContractTimeSlot" ("company_id", "contract_position_id", "day_date")
VALUES
  (1, 1, '2024-01-11'::TIMESTAMP),
  (1, 2, '2024-01-14'::TIMESTAMP),
  (1, 3, '2024-01-17'::TIMESTAMP),
  (2, 1, '2024-01-12'::TIMESTAMP),
  (2, 2, '2024-01-15'::TIMESTAMP),
  (2, 3, '2024-01-18'::TIMESTAMP),
  (3, 1, '2024-01-13'::TIMESTAMP),
  (3, 2, '2024-01-16'::TIMESTAMP),
  (3, 3, '2024-01-19'::TIMESTAMP),
  (4, 1, '2024-01-11'::TIMESTAMP),
  (4, 2, '2024-01-14'::TIMESTAMP),
  (4, 3, '2024-01-17'::TIMESTAMP),
  (5, 1, '2024-01-12'::TIMESTAMP),
  (5, 2, '2024-01-15'::TIMESTAMP),
  (5, 3, '2024-01-18'::TIMESTAMP),
  (6, 1, '2024-01-13'::TIMESTAMP),
  (6, 2, '2024-01-16'::TIMESTAMP),
  (6, 3, '2024-01-19'::TIMESTAMP),
  (7, 1, '2024-01-11'::TIMESTAMP),
  (7, 2, '2024-01-14'::TIMESTAMP),
  (7, 3, '2024-01-17'::TIMESTAMP),
  (8, 1, '2024-01-12'::TIMESTAMP),
  (8, 2, '2024-01-15'::TIMESTAMP),
  (8, 3, '2024-01-18'::TIMESTAMP),
  (9, 1, '2024-01-13'::TIMESTAMP),
  (9, 2, '2024-01-16'::TIMESTAMP),
  (9, 3, '2024-01-19'::TIMESTAMP),
  (10, 1, '2024-01-11'::TIMESTAMP),
  (10, 2, '2024-01-14'::TIMESTAMP),
  (10, 3, '2024-01-17'::TIMESTAMP),
  (11, 1, '2024-01-12'::TIMESTAMP),
  (11, 2, '2024-01-15'::TIMESTAMP),
  (11, 3, '2024-01-18'::TIMESTAMP),
  (12, 1, '2024-01-13'::TIMESTAMP),
  (12, 2, '2024-01-16'::TIMESTAMP),
  (12, 3, '2024-01-19'::TIMESTAMP),
  (13, 1, '2024-01-11'::TIMESTAMP),
  (13, 2, '2024-01-14'::TIMESTAMP),
  (13, 3, '2024-01-17'::TIMESTAMP);

-- Add more entries as needed for other companies and dates

-- Insert example data into the table "CompanyAddress" for each company in Ile-de-France
INSERT INTO "CompanyAddress" ("company_id", "street", "city", "zip", "country", "coordinates_lat", "coordinates_lon")
VALUES
  (1, '16 Rue de Bièvres', 'Clamart', '92140', 'France', '48.7996', '2.2634'),
  (2, '27 Bd Jean Jaurès', 'Boulogne-Billancourt', '92100', 'France', '48.8416', '2.2301'),
  (3, '2 All. du Marché', 'Melun', '77288', 'France', '48.5388', '2.6342'),
  (4, '8 Avenue Montaigne', 'Paris', '75008', 'France', '48.8697', '2.3095'),
  (5, '3 Rue de la Pompe', 'Neuilly-sur-Seine', '92200', 'France', '48.8818', '2.2693'),
  (6, '45 Quai des Orfèvres', 'Paris', '75001', 'France', '48.8576', '2.3466'),
  (7, '12 Avenue des Gobelins', 'Paris', '75013', 'France', '48.8338', '2.3529'),
  (8, '6 Rue de la République', 'Levallois-Perret', '92300', 'France', '48.8960', '2.2903'),
  (9, '18 Avenue de la Grande Armée', 'Paris', '75116', 'France', '48.8747', '2.2891'),
  (10, '10 Rue de Sèvres', 'Boulogne-Billancourt', '92100', 'France', '48.8337', '2.2363'),
  (11, '7 Rue de la Paix', 'Paris', '75002', 'France', '48.8689', '2.3315'),
  (12, '22 Boulevard Haussmann', 'Paris', '75009', 'France', '48.8723', '2.3340'),
  (13, '14 Avenue Foch', 'Paris', '75116', 'France', '48.8706', '2.2833');

-- Committing changes
COMMIT;

-- Insert example data into the "Skill" table
INSERT INTO "Skill" ("name")
VALUES
  ('Programmation'),
  ('Service Client'),
  ('Consultation'),
  ('Gestion de Projet'),
  ('Design Graphique'),
  ('Data Analysis'),
  ('Project Management'),
  ('UX/UI Design'),
  ('Database Administration'),
  ('Software Architecture'),
  ('Marketing Strategy'),
  ('Network Security'),
  ('Content Writing'),
  ('Financial Analysis'),
  ('Customer Relationship Management'),
  ('Mobile App Development');

-- Insert example data into the "WorkerSkill" table
INSERT INTO "WorkerSkill" ("worker_id", "skill_id")
VALUES
  (1, 2),
  (1, 5),
  (1, 8),
  (2, 3),
  (2, 6),
  (2, 9),
  (3, 1),
  (3, 4),
  (3, 7),
  (4, 2),
  (4, 5),
  (4, 8),
  (5, 3),
  (5, 6),
  (5, 9),
  (6, 1),
  (6, 4),
  (6, 7),
  (7, 2),
  (7, 5),
  (7, 8),
  (8, 3),
  (8, 6),
  (8, 9),
  (9, 1),
  (9, 4),
  (9, 7),
  (10, 2),
  (10, 5),
  (10, 8),
  (11, 3),
  (11, 6),
  (11, 9),
  (12, 1),
  (12, 4),
  (12, 7),
  (13, 2),
  (13, 5),
  (13, 8),
  (14, 3),
  (14, 6),
  (14, 9),
  (15, 1),
  (15, 4),
  (15, 7);

-- Insert example data into the table "CompanySkill" for each company
INSERT INTO "CompanySkill" ("company_id", "skill_id")
VALUES
  (1, 1),
  (1, 4),
  (1, 7),
  (2, 2),
  (2, 5),
  (2, 8),
  (3, 3),
  (3, 6),
  (3, 9),
  (4, 4),
  (4, 7),
  (4, 10),
  (5, 5),
  (5, 8),
  (5, 11),
  (6, 1),
  (6, 4),
  (6, 7),
  (7, 2),
  (7, 5),
  (7, 8),
  (8, 3),
  (8, 6),
  (8, 9),
  (9, 4),
  (9, 7),
  (9, 10),
  (10, 5),
  (10, 8),
  (10, 11),
  (11, 1),
  (11, 4),
  (11, 7),
  (12, 2),
  (12, 5),
  (12, 8),
  (13, 3),
  (13, 6),
  (13, 9);

-- Insert example data into the table "PostContractFeedback" for each company
INSERT INTO "PostContractFeedback" ("company_id", "worker_id", "worker_feedback_is_positive", "company_feedback_is_positive")
VALUES
  (1, 1, true, true),
  (1, 2, false, true),
  (1, 3, true, false),
  (1, 4, false, true),
  (1, 5, true, true),
  (1, 6, false, true),
  (1, 7, true, false),
  (1, 8, true, true),
  (1, 9, false, true),
  (1, 10, true, false),
  (2, 11, true, true),
  (2, 12, true, true),
  (2, 13, true, false),
  (2, 14, true, true),
  (2, 15, true, true),
  (2, 1, true, true),
  (2, 2, true, false),
  (2, 3, true, true),
  (2, 4, false, true),
  (2, 5, true, false),
  (3, 6, true, true),
  (3, 7, false, true),
  (3, 8, false, false),
  (3, 9, false, true),
  (3, 10, false, true),
  (3, 11, false, true),
  (3, 12, true, false),
  (3, 13, true, true),
  (3, 14, false, true),
  (3, 15, true, false),
  (4, 1, true, true),
  (4, 2, false, true),
  (4, 3, true, false),
  (4, 4, false, true),
  (4, 5, true, true),
  (4, 6, false, true),
  (4, 7, true, false),
  (4, 8, true, true),
  (4, 9, false, true),
  (4, 10, true, false),
  (5, 11, false, true),
  (5, 12, false, true),
  (5, 13, false, false),
  (5, 14, false, true),
  (5, 15, true, true),
  (5, 1, false, true),
  (5, 2, true, false),
  (5, 3, true, true),
  (5, 4, false, true),
  (5, 5, true, false),
  (6, 6, true, true),
  (6, 7, false, true),
  (6, 8, true, false),
  (6, 9, false, true),
  (6, 10, true, true),
  (6, 11, true, true),
  (6, 12, true, false),
  (6, 13, true, true),
  (6, 14, true, true),
  (6, 15, true, false),
  (7, 1, true, true),
  (7, 2, true, true),
  (7, 3, true, false),
  (7, 4, true, true),
  (7, 5, true, true),
  (7, 6, true, true),
  (7, 7, true, false),
  (7, 8, true, true),
  (7, 9, true, true),
  (7, 10, true, false),
  (8, 11, true, true),
  (8, 12, false, true),
  (8, 13, true, false),
  (8, 14, false, true),
  (8, 15, true, true),
  (8, 1, false, true),
  (8, 2, true, false),
  (8, 3, true, true),
  (8, 4, false, true),
  (8, 5, true, false),
  (9, 6, true, true),
  (9, 7, false, true),
  (9, 8, true, false),
  (9, 9, false, true),
  (9, 10, true, true),
  (9, 11, true, true),
  (9, 12, true, false),
  (9, 13, true, true),
  (9, 14, true, true),
  (9, 15, true, false),
  (10, 1, true, true),
  (10, 2, true, true),
  (10, 3, true, false),
  (10, 4, false, true),
  (10, 5, true, true),
  (10, 6, false, true),
  (10, 7, true, false),
  (10, 8, true, true),
  (10, 9, false, true),
  (10, 10, true, false),
  (11, 11, true, true),
  (11, 12, false, true),
  (11, 13, true, false),
  (11, 14, false, true),
  (11, 15, true, true),
  (11, 1, false, true),
  (11, 2, true, false),
  (11, 3, true, true),
  (11, 4, false, true),
  (11, 5, true, false),
  (12, 6, true, true),
  (12, 7, false, true),
  (12, 8, true, false),
  (12, 9, false, true),
  (12, 10, true, true),
  (12, 11, false, true),
  (12, 12, true, false),
  (12, 13, true, true),
  (12, 14, false, true),
  (12, 15, true, false),
  (13, 1, true, true),
  (13, 2, false, true),
  (13, 3, true, false),
  (13, 4, false, true),
  (13, 5, true, true),
  (13, 6, false, true),
  (13, 7, true, false),
  (13, 8, true, true),
  (13, 9, false, true),
  (13, 10, true, false);

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


