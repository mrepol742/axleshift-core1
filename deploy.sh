npm run lint
npm run test

echo "Enter commit message:"
read commit_message

git add .
git commit -S -m "$commit_message"
git push