<?php
/**
 * PrimeXPixel — Contact form mail handler
 * Receives a POST from the React contact form and emails it to info@primexpixel.in
 * using the server's own mail() function (no third-party service, no API key).
 *
 * Upload this file to the SAME folder as your live site (e.g. public_html/send-mail.php)
 * — it is already copied there automatically when you build the React app (it lives in
 * the /public folder of the project, so `npm run build` puts it straight into /dist).
 */

// ---- Basic setup ----
header('Content-Type: application/json; charset=utf-8');

// Allow the request to come from your own domain only.
// If your site is on a different domain than this script, add it here.
$allowedOrigins = [
  'https://primexpixel.in',
  'https://www.primexpixel.in',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
  header('Access-Control-Allow-Origin: ' . $origin);
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Preflight request — just acknowledge it.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
  exit;
}

// ---- Read input (JSON body) ----
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
  // fall back to normal form-encoded POST, just in case
  $data = $_POST;
}

$name    = trim(strip_tags($data['name']    ?? ''));
$email   = trim(strip_tags($data['email']   ?? ''));
$phone   = trim(strip_tags($data['phone']   ?? ''));
$service = trim(strip_tags($data['service'] ?? ''));
$message = trim(strip_tags($data['message'] ?? ''));

// Honeypot field — real visitors never fill this. If it's filled, silently "succeed" to fool bots.
$honeypot = trim($data['website'] ?? '');
if ($honeypot !== '') {
  echo json_encode(['ok' => true]);
  exit;
}

// ---- Validate ----
$errors = [];
if ($name === '') $errors[] = 'Name is required';
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Valid email is required';
if ($message === '') $errors[] = 'Message is required';

if (!empty($errors)) {
  http_response_code(422);
  echo json_encode(['ok' => false, 'error' => implode(', ', $errors)]);
  exit;
}

// ---- Build the email ----
$to      = 'info@primexpixel.in';
$subject = 'New enquiry from ' . $name . ($service ? ' — ' . $service : '');

$body  = "You have a new enquiry from the PrimeXPixel website:\n\n";
$body .= "Name: {$name}\n";
$body .= "Email: {$email}\n";
$body .= "Phone: " . ($phone !== '' ? $phone : '—') . "\n";
$body .= "Service: " . ($service !== '' ? $service : '—') . "\n\n";
$body .= "Message:\n{$message}\n";

// IMPORTANT: "From" should be an address on YOUR OWN domain (not the visitor's address)
// or many mail servers will mark it as spam / reject it outright. The visitor's address
// goes in "Reply-To" so hitting Reply in your inbox replies straight to them.
$fromAddress = 'no-reply@primexpixel.in';
$headers  = "From: PrimeXPixel Website <{$fromAddress}>\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// ---- Send ----
$success = @mail($to, $subject, $body, $headers);

if ($success) {
  echo json_encode(['ok' => true]);
} else {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Could not send email. Please try WhatsApp instead.']);
}
