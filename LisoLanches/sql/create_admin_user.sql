-- Recupera o ID da Role (seja a recém-criada ou a existente)
SET @ActualRoleId = (SELECT Id FROM AspNetRoles WHERE NormalizedName = 'ADMIN' LIMIT 1);

-- Recupera o ID do Usuário (seja o recém-criado ou o existente)
SET @ActualUserId = (SELECT Id FROM Users WHERE NormalizedEmail = 'ADMIN@LISOLANCHES.COM' LIMIT 1);

-- 3. Vincular o usuário recém-criado à Role 'Admin'
INSERT INTO AspNetUserRoles (UserId, RoleId)
SELECT @ActualUserId, @ActualRoleId
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM AspNetUserRoles WHERE UserId = @ActualUserId AND RoleId = @ActualRoleId);
