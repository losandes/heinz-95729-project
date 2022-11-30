rm ./deployable.zip

#pack build
zip -r ./deployable.zip ./src ./package.json

#cd into terraform directory
cd ./terraform

#run terraform apply
terraform destroy

terraform apply


