<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use App\Entity\Task;
use Symfony\Component\Validator\Validator\ValidatorInterface;


final class TaskController extends AbstractController {

    //Affiche la liste des taches
    #[Route('/task', methods: ['GET'], name: 'app_task')]
    public function index(EntityManagerInterface $em, serializerInterface $serializer): JsonResponse {
        $tasks = $em->getRepository(Task::class)->findAll();

        $json = $serializer->serialize($tasks, 'json');
        return new JsonResponse(json_decode($json), Response::HTTP_OK);
    }


    //Crée une nouvelle tache
    #[Route('/task/create', methods: ['POST'], name: 'task_create')]
    public function create(Request $request, EntityManagerInterface $em, ValidatorInterface $validator): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $task = new Task();
        $task->setTitle($data['title']);
        $task->setDescription($data['description']);
        $task->setStatus(false);

        $errors = $validator->validate($task);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getPropertyPath() . ': ' . $error->getMessage();
            }

            return new JsonResponse(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
        }

        $em->persist($task);
        $em->flush();

        return new JsonResponse(['message' => 'Tâche créée'], Response::HTTP_CREATED);
    }

    //Modifie une tache
    #[Route('/task/{id}/modify', methods: ['PUT'], name: 'task_modify')]
    public function modify(Request $request, EntityManagerInterface $em, int $id, ValidatorInterface $validator): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $task = $em->getRepository(Task::class)->find($id);

        if (!$task) {
            return new JsonResponse(['message' => 'Tâche introuvable'], Response::HTTP_NOT_FOUND);
        }

        $errors = $validator->validate($task);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getPropertyPath() . ': ' . $error->getMessage();
            }

            return new JsonResponse(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
        }

        $task->setTitle($data['title']);
        $task->setDescription($data['description']);
        $task->setStatus($data['status']);
        $em->persist($task);
        $em->flush();
        return new JsonResponse(['message' => 'Tâche modifiée'], Response::HTTP_OK);
    }

    //Supprime une tache
    #[Route('/task/{id}/delete', methods: ['DELETE'], name: 'task_delete')]
    public function delete(EntityManagerInterface $em, int $id): JsonResponse {
        $task = $em->getRepository(Task::class)->find($id);
        if (!$task) {
            return new JsonResponse(['message' => 'Tâche introuvable'], Response::HTTP_NOT_FOUND);
        }
        $em->remove($task);
        $em->flush();
        return new JsonResponse(['message' => 'Tâche supprimée'], Response::HTTP_OK);
    }

    //Affiche une tache
    #[Route('/task/{id}', methods: ['GET'], name: 'task_show')]
    public function show(EntityManagerInterface $em, int $id, SerializerInterface $serializer): JsonResponse {
        $task = $em->getRepository(Task::class)->find($id);

        if (!$task) {
            return new JsonResponse(['message' => 'Tâche introuvable'], Response::HTTP_NOT_FOUND);
        }

        $json = $serializer->serialize($task, 'json');

        return new JsonResponse(json_decode($json), Response::HTTP_OK); // on redécode pour éviter dupliquer les en-têtes JSON
    }

    //Valider une tache
    #[Route('/task/{id}/validate', methods: ['PUT'], name: 'task_validate')]
    public function validate(EntityManagerInterface $em, int $id): JsonResponse {
        $task = $em->getRepository(Task::class)->find($id);
        if (!$task) {
            return new JsonResponse(['message' => 'Tâche introuvable'], Response::HTTP_NOT_FOUND);
        }
        $task->setStatus(true);
        $em->persist($task);
        $em->flush();
        return new JsonResponse(['message' => 'Tâche validée'], Response::HTTP_OK);
    }
}
