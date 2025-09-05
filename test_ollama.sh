set -e
# Load env from .env.local without echoing secrets
if [ -f .env.local ]; then
  set -a
  # shellcheck disable=SC1091
  . ./.env.local
  set +a
else
  echo ".env.local not found in $(pwd)" >&2
  exit 1
fi

URL="${OLLAMA_API_URL:-}"
MODEL="${OLLAMA_MODEL:-llama3}"
KEY_PRESENT="absent"
[ -n "${NEXT_PUBLIC_OLLAMA_API_KEY:-}" ] && KEY_PRESENT="present"

if [ -z "$URL" ]; then
  echo "OLLAMA_API_URL is empty after loading .env.local" >&2
  exit 2
fi

echo "-> Hitting: $URL"
echo "-> Model: $MODEL"
echo "-> API key: $KEY_PRESENT"

DATA=$(printf '{"model":"%s","messages":[{"role":"user","content":"ping"}],"stream":false}' "$MODEL")

HTTP_CODE=$(curl -sS -o /tmp/ollama_ping_body.$$ -w "%{http_code}" \
  -X POST "$URL" \
  -H 'Content-Type: application/json' \
  ${NEXT_PUBLIC_OLLAMA_API_KEY:+-H "Authorization: Bearer $NEXT_PUBLIC_OLLAMA_API_KEY"} \
  -d "$DATA")

echo "-> HTTP: $HTTP_CODE"
# Show up to 80 lines of the response body without leaking secrets
head -n 80 /tmp/ollama_ping_body.$$ || true
rm -f /tmp/ollama_ping_body.$$ || true