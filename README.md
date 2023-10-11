### kw-mvn sample spring boot application
---
```bash

# SVN setup
docker volume create svn-root
docker run -dit --name svn-server -v svn-root:/home/svn -p 7443:80 -p 3690:3690 -w /home/svn elleflorio/svn-server
docker exec -t svn-server htpasswd -b /etc/subversion/passwd svnadmin 1

# Create Repo
docker exec -it svn-server svnadmin create pnu-test

# Configure Auth
docker exec -it svn-server sh

vi pnu-test/conf/svnserve.conf
>> anon-access = read
>> auth-access = write
>> password-db = passwd
>> authz-db = authz

vi pnu-test/conf/authz
>> [groups]
>> admin_group = jaehoon

>> [/]
>> @admin_group  = rw
>> jaehoon = rw

vi pnu-test/conf/passwd
>> [users]
>> jaehoon = 1

svn info --username jaehoon svn://localhost:3690/pnu-test

# Import PNU-TEST repo
git clone -b pnu-test https://github.com/flytux/kw-mvn
svn import kw-mvn --username jaehoon svn://localhost:3690/pnu-test/trunk

svn co --username=jaehoon --password=1 svn://localhost:3690/pnu-test

# Copy SVN source to git
cp -R pnu-test/trunk/* kw-mvn/

# Push git
cd kw-mvn

git add .
git commit -m "update SVN source"
git push origin main
```




