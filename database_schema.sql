CREATE TABLE IF NOT EXISTS "vehicles" (
	"id" serial PRIMARY KEY NOT NULL,
	"imei" text NOT NULL,
	"lat" numeric NOT NULL,
	"lng" numeric NOT NULL,
	"speed" numeric,
	"battery" numeric,
	"altitude" numeric,
	"timestamp" timestamp DEFAULT now(),
	CONSTRAINT "vehicles_imei_unique" UNIQUE("imei")
);
