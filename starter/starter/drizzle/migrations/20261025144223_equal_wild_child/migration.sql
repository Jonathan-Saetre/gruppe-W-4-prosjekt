CREATE TABLE `produce` (
	`id` text PRIMARY KEY,
	`title` text NOT NULL,
	`description` text,
	`category` text NOT NULL,
	`pickup_location` text NOT NULL,
	`amount` real NOT NULL,
	`pickup_deadline` integer NOT NULL,
	`pickedUp` integer DEFAULT false NOT NULL,
	`unit` text NOT NULL,
	`user_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	`image_key` text,
	CONSTRAINT `fk_produce_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE INDEX `idx_produce_user_id` ON `produce` (`user_id`);